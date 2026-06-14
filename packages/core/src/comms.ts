/**
 * Communication helpers (SPEC §6.5). Thread summarisation surfaces every item
 * that needs the user's action and fabricates none (AC-P9). Outgoing drafts are
 * always gated by approval unless the category is full-auto (AC-P10).
 */
import { type AutonomyLevel } from "@myfamily/ui";

export interface Message {
  from: string;
  body: string;
}

const ACTION_CUES = [/\bcan you\b/i, /\bplease\b/i, /\bneed\b/i, /\bby (mon|tue|wed|thu|fri|sat|sun|tomorrow|\d)/i, /\brsvp\b/i, /\bsign\b/i, /\bbring\b/i, /\?\s*$/];

/**
 * Extract action items verbatim from a thread. Only real message text is
 * returned — nothing is invented (AC-P9: zero hallucinated commitments).
 */
export function summariseActionItems(thread: Message[]): { from: string; body: string }[] {
  return thread
    .filter((m) => ACTION_CUES.some((re) => re.test(m.body)))
    .map((m) => ({ from: m.from, body: m.body.trim() }));
}

export interface DraftDecision {
  requiresApproval: boolean;
}

/** A drafted outgoing message is shown for approval unless full-auto (AC-P10). */
export function draftGate(level: AutonomyLevel): DraftDecision {
  return { requiresApproval: level !== "full_auto" };
}
