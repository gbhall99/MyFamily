/**
 * The Daily Brief assembler (SPEC §7.3, DESIGN_SPEC §6.1 / AC-P16 / AC-DA6).
 * One glanceable briefing: today's logistics, caught conflicts, AT MOST 3 one-tap
 * decisions, and what was already handled. The ≤3 cap is enforced here so the
 * surface can never overwhelm.
 */
import type { Conflict } from "./conflict.js";

export interface Decision {
  id: string;
  prompt: string;
  /** Higher = more important; used to keep the top 3 when there are more. */
  priority: number;
}

export interface BriefInput {
  logistics: string[];
  conflicts: Conflict[];
  decisions: Decision[];
  handled: string[];
}

export interface Brief {
  logistics: string[];
  conflicts: Conflict[];
  decisions: Decision[]; // ≤ 3, highest priority first
  handled: string[];
  deferredDecisionCount: number;
}

export const MAX_DECISIONS = 3;

export function assembleBrief(input: BriefInput): Brief {
  const ranked = [...input.decisions].sort((a, b) => b.priority - a.priority);
  const top = ranked.slice(0, MAX_DECISIONS);
  return {
    logistics: input.logistics,
    conflicts: input.conflicts,
    decisions: top,
    handled: input.handled,
    deferredDecisionCount: Math.max(0, ranked.length - MAX_DECISIONS),
  };
}
