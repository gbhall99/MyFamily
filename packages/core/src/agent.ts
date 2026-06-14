/**
 * Provider-agnostic agent layer (per approved decision: Claude first, not
 * coupled). The app depends ONLY on these interfaces; concrete providers
 * (Claude, or a sandbox mock for tests/dev) are injected. This is what keeps the
 * model swappable and lets the whole pipeline run against mocks until live
 * credentials are approved (DELIVERY_PROMPT §7 / §2.6 sandbox-by-default).
 */

export interface ExtractedEvent {
  title: string;
  /** ISO date (YYYY-MM-DD) or null if not found. */
  date: string | null;
  /** HH:MM 24h or null. */
  time: string | null;
  location: string | null;
  /** Which family member this concerns, if detected. */
  child: string | null;
  /** Model confidence 0–1; below threshold → defer to a human (AC-G9). */
  confidence: number;
}

export type CaptureInput =
  | { kind: "photo"; ref: string; ocrText?: string }
  | { kind: "text"; body: string }
  | { kind: "email"; subject: string; body: string }
  | { kind: "voice"; transcript: string };

/** The one capability capture needs from a model provider. */
export interface EventExtractor {
  extractEvent(input: CaptureInput): Promise<ExtractedEvent>;
}

/** Below this confidence the pipeline asks rather than acts (AC-G9). */
export const CONFIDENCE_THRESHOLD = 0.7;
