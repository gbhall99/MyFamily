/**
 * The autonomy ladder (SPEC §7.4, DESIGN_SPEC §6.1 autonomy-ladder control).
 * Encodes the binding behaviour decided by AC-P14: Notify never acts;
 * Full-auto never interrupts. Every level is reversible/visible by construction.
 */
export const AUTONOMY_LEVELS = ["notify", "suggest", "auto_undo", "full_auto"] as const;
export type AutonomyLevel = (typeof AUTONOMY_LEVELS)[number];

/** Does the agent perform the action itself at this level? (Notify never acts.) */
export function actsAutomatically(level: AutonomyLevel): boolean {
  return level === "auto_undo" || level === "full_auto";
}

/** Does acting interrupt the user for approval? (Full-auto never interrupts.) */
export function interruptsForApproval(level: AutonomyLevel): boolean {
  return level === "suggest";
}

/** Plain-language consequence shown on the control (AC-DA7: unmistakable). */
export function consequenceCopy(level: AutonomyLevel): string {
  switch (level) {
    case "notify":
      return "I'll flag it. You do it.";
    case "suggest":
      return "I'll draft it and ask before doing anything.";
    case "auto_undo":
      return "I'll do it and tell you — undo anytime.";
    case "full_auto":
      return "I'll handle it quietly.";
  }
}
