/**
 * Fair-Share load-balancing (SPEC §6.3 — signature feature / AC-P5, AC-P6).
 * Crucially counts ANTICIPATORY / COGNITIVE work (planning, remembering,
 * organising), not just completed chores, and routes the next task to the
 * under-loaded member to rebalance.
 */
export type LoadKind = "physical" | "cognitive";

export interface Task {
  id: string;
  assignee: string;
  effort: number; // relative weight
  kind: LoadKind;
}

export interface LoadBreakdown {
  byMember: Record<string, { physical: number; cognitive: number; total: number }>;
}

export function computeLoad(tasks: Task[], members: string[]): LoadBreakdown {
  const byMember: LoadBreakdown["byMember"] = {};
  for (const m of members) byMember[m] = { physical: 0, cognitive: 0, total: 0 };
  for (const t of tasks) {
    const bucket = byMember[t.assignee];
    if (!bucket) continue;
    bucket[t.kind] += t.effort;
    bucket.total += t.effort;
  }
  return { byMember };
}

/** Whether cognitive load is actually represented (AC-P5: not just chores). */
export function includesCognitiveLoad(load: LoadBreakdown): boolean {
  return Object.values(load.byMember).some((b) => b.cognitive > 0);
}

/** Route the next task to the least-loaded member to rebalance (AC-P6). */
export function nextAssignee(load: LoadBreakdown): string | null {
  const entries = Object.entries(load.byMember);
  if (entries.length === 0) return null;
  return entries.reduce((min, cur) => (cur[1].total < min[1].total ? cur : min))[0];
}
