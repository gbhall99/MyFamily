/**
 * Eldercare shared log (SPEC §6.10② / AC-P32). A care task is owned by exactly
 * one sibling and completed once, so nothing is dropped or duplicated across the
 * sibling group (e.g. meds aren't given twice, an appointment has one owner).
 */
export interface CareItem {
  id: string;
  what: string;
  owner?: string;
  doneBy?: string;
  doneAt?: number;
}

export type CareResult = { ok: true } | { ok: false; reason: string };

/** Claim ownership. Fails if someone else already owns it (no double-assignment). */
export function claimCare(items: Map<string, CareItem>, id: string, who: string): CareResult {
  const it = items.get(id);
  if (!it) return { ok: false, reason: "unknown task" };
  if (it.owner && it.owner !== who) return { ok: false, reason: `already owned by ${it.owner}` };
  it.owner = who;
  return { ok: true };
}

/** Mark done. Fails if already completed (no duplication, e.g. meds given twice). */
export function completeCare(items: Map<string, CareItem>, id: string, who: string, at: number): CareResult {
  const it = items.get(id);
  if (!it) return { ok: false, reason: "unknown task" };
  if (it.doneBy) return { ok: false, reason: `already done by ${it.doneBy}` };
  it.doneBy = who;
  it.doneAt = at;
  return { ok: true };
}

/**
 * Eldercare follow-up (SPEC §6.10③ / AC-P33). Distributes unowned care tasks
 * across the sibling group, balancing onto the least-loaded sibling so the work
 * is shared rather than landing on one person.
 */
export interface CareAssignment {
  taskId: string;
  assignee: string;
}

export function distributeCare(tasks: { id: string }[], siblings: string[], currentLoad: Record<string, number> = {}): CareAssignment[] {
  const load: Record<string, number> = {};
  for (const s of siblings) load[s] = currentLoad[s] ?? 0;
  const out: CareAssignment[] = [];
  for (const t of tasks) {
    const assignee = siblings.reduce((min, s) => (load[s]! < load[min]! ? s : min), siblings[0]!);
    load[assignee]!++;
    out.push({ taskId: t.id, assignee });
  }
  return out;
}
