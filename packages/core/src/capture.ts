/**
 * Universal capture pipeline (SPEC §6.1). Any input (photo/text/email/voice) →
 * a structured event, with a confidence gate that DEFERS to a human when unsure
 * instead of acting wrongly (AC-G9). Entity resolution prevents silent duplicate
 * providers (AC-P2). Model-agnostic: the EventExtractor is injected (AC: AI layer).
 */
import { type CaptureInput, type EventExtractor, type ExtractedEvent, CONFIDENCE_THRESHOLD } from "./agent.js";

export type CaptureOutcome =
  | { status: "filed"; event: ExtractedEvent }
  | { status: "needs_review"; event: ExtractedEvent; reason: string };

/** Run capture. Low-confidence or missing essentials → needs_review (never silent wrong fill). */
export async function capture(input: CaptureInput, extractor: EventExtractor): Promise<CaptureOutcome> {
  const event = await extractor.extractEvent(input);
  if (event.confidence < CONFIDENCE_THRESHOLD) {
    return { status: "needs_review", event, reason: "low confidence" };
  }
  if (!event.title || !event.date) {
    return { status: "needs_review", event, reason: "missing title or date" };
  }
  return { status: "filed", event };
}

// --- Entity resolution: never create a conflicting duplicate provider (AC-P2) ---

export interface Provider {
  id: string;
  name: string;
  /** Normalised key used for matching (lowercased, noise-stripped). */
  kind: "dentist" | "doctor" | "school" | "coach" | "other";
}

const STOPWORDS = ["dr", "the", "family", "clinic", "dental", "practice", "office", "centre", "center"];

export function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.includes(w))
    .sort()
    .join(" ");
}

export type ResolveResult =
  | { action: "matched"; provider: Provider }
  | { action: "ambiguous"; candidates: Provider[] }
  | { action: "created"; provider: Provider };

/**
 * Resolve an incoming provider against known ones. Returns an existing match,
 * flags ambiguity, or signals a genuinely new provider — but NEVER silently
 * creates a duplicate of one already known (AC-P2).
 */
export function resolveProvider(
  incoming: { name: string; kind: Provider["kind"] },
  known: Provider[],
): ResolveResult {
  const key = normaliseName(incoming.name);
  const sameKind = known.filter((p) => p.kind === incoming.kind);
  const exact = sameKind.filter((p) => normaliseName(p.name) === key);
  if (exact.length === 1) return { action: "matched", provider: exact[0]! };

  const overlapping = sameKind.filter((p) => sharesToken(normaliseName(p.name), key));
  if (exact.length > 1) return { action: "ambiguous", candidates: exact };
  if (overlapping.length > 0) return { action: "ambiguous", candidates: overlapping };

  return {
    action: "created",
    provider: { id: `prov_${key.replace(/ /g, "_")}`, name: incoming.name, kind: incoming.kind },
  };
}

function sharesToken(a: string, b: string): boolean {
  const at = new Set(a.split(" ").filter(Boolean));
  return b.split(" ").some((t) => t && at.has(t));
}
