/**
 * Kids, school & activities — time-sensitive windows (SPEC §6.7② / AC-P26).
 * Surfaces a child's upcoming deadlines (well-visit, a registration that sells
 * out, a sign-up window) with enough lead time to act, assigned to a responsible
 * adult, and never surfaces ones already past.
 */
const DAY = 86_400_000;

export interface ChildWindow {
  child: string;
  title: string;
  dueAt: number; // the deadline to act by
  leadDays?: number; // how far ahead to surface it
  assignTo: string;
}

export interface SurfacedWindow extends ChildWindow {
  surfaceAt: number;
}

/** Windows that should be surfaced at `now`: lead time has started and the deadline hasn't passed. */
export function dueWindows(windows: ChildWindow[], now: number): SurfacedWindow[] {
  return windows
    .map((w) => ({ ...w, surfaceAt: w.dueAt - (w.leadDays ?? 21) * DAY }))
    .filter((w) => now >= w.surfaceAt && now < w.dueAt)
    .sort((a, b) => a.dueAt - b.dueAt);
}
