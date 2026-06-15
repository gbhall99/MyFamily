/**
 * Auto-task generation (SPEC §6.3② / AC-P22). Turns implied obligations — an RSVP
 * deadline, a gift need, an expiring document — into dated, assigned tasks with
 * enough lead time to act, and never duplicates a task the family already has.
 */
export type SignalKind = "rsvp" | "gift" | "renewal" | "deadline";

export interface Signal {
  kind: SignalKind;
  subject: string; // e.g. "Leo's party", "passport"
  due: number; // epoch ms
  assignTo: string;
  leadDays?: number;
}

export interface GeneratedTask {
  id: string;
  title: string;
  assignee: string;
  due: number;
  remindAt: number; // due − lead time
  source: SignalKind;
}

const DEFAULT_LEAD: Record<SignalKind, number> = { rsvp: 2, gift: 5, renewal: 60, deadline: 3 };

export function taskTitle(s: Signal): string {
  switch (s.kind) {
    case "rsvp":
      return `RSVP to ${s.subject}`;
    case "gift":
      return `Buy a gift for ${s.subject}`;
    case "renewal":
      return `Renew ${s.subject}`;
    case "deadline":
      return s.subject;
  }
}

/** Generate tasks from signals, skipping any whose title already exists (AC-P22 no-dupes). */
export function generateTasks(signals: Signal[], existing: { title: string }[] = []): GeneratedTask[] {
  const have = new Set(existing.map((t) => t.title.toLowerCase()));
  const out: GeneratedTask[] = [];
  for (const s of signals) {
    const title = taskTitle(s);
    if (have.has(title.toLowerCase())) continue;
    have.add(title.toLowerCase());
    const leadDays = s.leadDays ?? DEFAULT_LEAD[s.kind];
    out.push({
      id: `task_${s.kind}_${s.subject}`.replace(/\s+/g, "_").toLowerCase(),
      title,
      assignee: s.assignTo,
      due: s.due,
      remindAt: s.due - leadDays * 86_400_000,
      source: s.kind,
    });
  }
  return out;
}
