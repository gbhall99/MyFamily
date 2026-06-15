/**
 * Whole-family health view + proactive prompts (SPEC §6.8② / AC-P28). Surfaces a
 * "refill" before a medication runs out and a "book" before a routine visit is
 * due, scoped to the right member. Booking/financial steps are NOT taken here —
 * those are gated (AC-P29).
 */
const DAY = 86_400_000;

export interface Medication {
  name: string;
  member: string;
  daysSupplyLeft: number;
}

export interface RoutineVisit {
  member: string;
  kind: string; // e.g. "annual physical", "eye test"
  lastDoneAt: number;
  intervalDays: number;
}

export interface HealthPrompt {
  member: string;
  kind: "refill" | "book_visit";
  detail: string;
}

export function healthPrompts(
  meds: Medication[],
  visits: RoutineVisit[],
  now: number,
  refillLeadDays = 7,
): HealthPrompt[] {
  const out: HealthPrompt[] = [];
  for (const m of meds) {
    if (m.daysSupplyLeft <= refillLeadDays) out.push({ member: m.member, kind: "refill", detail: `${m.name} — ${m.daysSupplyLeft} days left` });
  }
  for (const v of visits) {
    if (now - v.lastDoneAt >= v.intervalDays * DAY) out.push({ member: v.member, kind: "book_visit", detail: `${v.kind} is due` });
  }
  return out;
}
