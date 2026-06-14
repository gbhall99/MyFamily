/**
 * The hero one-tap Approve / Decision interaction (DESIGN_SPEC §6.1, §7.3;
 * SPEC §7). Pure state model so the binding behaviour is testable without a
 * renderer. Evidence toward AC-DA4, AC-DA5, AC-G5, AC-P15.
 */
import { type AutonomyLevel, actsAutomatically } from "./autonomy.js";
import { type ActivityEntry, logEntry } from "./activityLog.js";

export interface Suggestion {
  id: string;
  /** What the agent proposes, in plain language (shown before acting). */
  summary: string;
  /** Why — the source/reason (AC-DA13 content rule). */
  reason: string;
  category: string;
  /** The reversible effect to apply on accept. */
  apply: () => void;
  /** Reverse of `apply`, used by undo (AC-G5 reversibility). */
  revert: () => void;
}

export type Decision = "accept" | "edit" | "decline";

export interface ApproveResult {
  decision: Decision;
  /** True only when the action was actually performed (accept). */
  acted: boolean;
  /** Present after an accept: a visible, callable undo (AC-DA5). */
  undo?: () => void;
  /** The activity-log entry recorded for any action (AC-P15 / AC-G5). */
  logged?: ActivityEntry;
}

/**
 * Resolve a suggestion in a SINGLE call (= one gesture, AC-DA4). `edit` and
 * `decline` are first-class, non-destructive outcomes. Accept performs the
 * effect, records an explained + undoable log entry, and returns a visible undo.
 */
export function decide(
  suggestion: Suggestion,
  decision: Decision,
  log: ActivityEntry[],
): ApproveResult {
  if (decision !== "accept") {
    return { decision, acted: false };
  }
  suggestion.apply();
  let undone = false;
  const entry = logEntry(log, {
    summary: suggestion.summary,
    reason: suggestion.reason,
    category: suggestion.category,
  });
  const undo = (): void => {
    if (undone) return;
    suggestion.revert();
    entry.undoneAt = Date.now();
    undone = true;
  };
  return { decision, acted: true, undo, logged: entry };
}

/**
 * When an agent acts on its own (auto levels), the same accept path runs so the
 * action is ALWAYS logged + undoable — never a silent unlogged change (AC-G5).
 */
export function actAutonomously(
  suggestion: Suggestion,
  level: AutonomyLevel,
  log: ActivityEntry[],
): ApproveResult | null {
  if (!actsAutomatically(level)) return null;
  return decide(suggestion, "accept", log);
}
