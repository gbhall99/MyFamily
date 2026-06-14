/**
 * The "everything I did for you" activity log (SPEC §7.4). Every agent action is
 * appended with a plain-language reason and an undo window (AC-G5 / AC-P15).
 */
export interface ActivityEntry {
  summary: string;
  reason: string;
  category: string;
  at: number;
  /** Set when the action is undone; absent means still in effect. */
  undoneAt?: number;
}

/** Append an explained entry to the log and return it. */
export function logEntry(
  log: ActivityEntry[],
  e: Pick<ActivityEntry, "summary" | "reason" | "category">,
): ActivityEntry {
  const entry: ActivityEntry = { ...e, at: Date.now() };
  log.push(entry);
  return entry;
}
