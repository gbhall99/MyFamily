/**
 * Conflict radar (SPEC §6.2). Detects logistic clashes — two events that overlap
 * in time AND need the same scarce resource (a driver/car) — BEFORE the day, and
 * explains them in plain language with at least one concrete resolution (AC-P3).
 */
export interface FamilyEvent {
  id: string;
  title: string;
  /** epoch ms */
  start: number;
  end: number;
  member: string;
  /** Needs an adult to drive/accompany. */
  needsDriver: boolean;
  location: string;
}

export interface Conflict {
  a: FamilyEvent;
  b: FamilyEvent;
  explanation: string;
  resolutions: string[];
}

const overlaps = (a: FamilyEvent, b: FamilyEvent): boolean => a.start < b.end && b.start < a.end;

/**
 * Find driver/time conflicts among upcoming events. `now` lets us prove the
 * conflict is surfaced *before* the event (the "before the day" guarantee).
 */
export function detectConflicts(events: FamilyEvent[], now: number): Conflict[] {
  const upcoming = events.filter((e) => e.start > now).sort((a, b) => a.start - b.start);
  const out: Conflict[] = [];
  for (let i = 0; i < upcoming.length; i++) {
    for (let j = i + 1; j < upcoming.length; j++) {
      const a = upcoming[i]!;
      const b = upcoming[j]!;
      if (a.needsDriver && b.needsDriver && overlaps(a, b) && a.location !== b.location) {
        out.push({
          a,
          b,
          explanation: `${a.member}'s ${a.title} and ${b.member}'s ${b.title} overlap and are in different places — one driver can't cover both.`,
          resolutions: [
            `Ask another parent to drive ${b.member} to ${b.title}`,
            `Move ${b.title} to a different time`,
            `Arrange a carpool for ${a.title}`,
          ],
        });
      }
    }
  }
  return out;
}
