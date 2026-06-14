/**
 * Proactivity engine (SPEC §6 / AC-G4). Scans family state and surfaces the right
 * thing BEFORE the user asks. Paired with a scenario eval harness so "surfaces in
 * ≥70% of relevant cases" is measurable; production ≥70% on live data is the
 * remaining half.
 */
export interface FamilyState {
  conflicts: number;
  permissionSlipsDue: number;
  loadImbalanceRatio: number; // busiest / least-busy member
  mealGapsThisWeek: number;
  unreadActionItems: number;
}

export interface Surfacing {
  kind: "conflict" | "permission_slip" | "load_imbalance" | "meal_gap" | "action_items";
  reason: string;
}

export function surfaceProactive(s: FamilyState): Surfacing[] {
  const out: Surfacing[] = [];
  if (s.conflicts > 0) out.push({ kind: "conflict", reason: `${s.conflicts} schedule conflict(s) ahead` });
  if (s.permissionSlipsDue > 0) out.push({ kind: "permission_slip", reason: `${s.permissionSlipsDue} slip(s) due` });
  if (s.loadImbalanceRatio > 1.5) out.push({ kind: "load_imbalance", reason: "household load is uneven" });
  if (s.mealGapsThisWeek > 0) out.push({ kind: "meal_gap", reason: `${s.mealGapsThisWeek} night(s) without a plan` });
  if (s.unreadActionItems >= 3) out.push({ kind: "action_items", reason: `${s.unreadActionItems} items need action` });
  return out;
}

/** Recall over labelled scenarios: fraction of "should surface" cases that do (AC-G4). */
export function proactivityRecall(scenarios: { state: FamilyState; shouldSurface: boolean }[]): number {
  const positives = scenarios.filter((s) => s.shouldSurface);
  if (positives.length === 0) return 1;
  const hit = positives.filter((s) => surfaceProactive(s.state).length > 0).length;
  return hit / positives.length;
}
