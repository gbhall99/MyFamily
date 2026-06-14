import { describe, it, expect } from "vitest";
import { detectConflicts, type FamilyEvent } from "../src/conflict.js";

const NOW = Date.parse("2026-06-15T08:00:00Z");
const at = (iso: string) => Date.parse(iso);

function ev(p: Partial<FamilyEvent> & { id: string; member: string; start: string; end: string }): FamilyEvent {
  return {
    title: p.title ?? "Practice",
    needsDriver: p.needsDriver ?? true,
    location: p.location ?? "Field A",
    ...p,
    start: at(p.start),
    end: at(p.end),
  } as FamilyEvent;
}

describe("Conflict radar (AC-P3)", () => {
  it("detects an overlapping two-driver clash before the day, with resolutions", () => {
    const events = [
      ev({ id: "1", member: "Leo", title: "Soccer", start: "2026-06-18T17:00:00Z", end: "2026-06-18T18:00:00Z", location: "Field A" }),
      ev({ id: "2", member: "Mia", title: "Swim", start: "2026-06-18T17:30:00Z", end: "2026-06-18T18:30:00Z", location: "Pool B" }),
    ];
    const conflicts = detectConflicts(events, NOW);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]!.explanation).toMatch(/overlap/i);
    expect(conflicts[0]!.resolutions.length).toBeGreaterThanOrEqual(1);
  });

  it("does not flag same-location overlaps (one trip covers both)", () => {
    const events = [
      ev({ id: "1", member: "Leo", start: "2026-06-18T17:00:00Z", end: "2026-06-18T18:00:00Z", location: "Field A" }),
      ev({ id: "2", member: "Mia", start: "2026-06-18T17:00:00Z", end: "2026-06-18T18:00:00Z", location: "Field A" }),
    ];
    expect(detectConflicts(events, NOW)).toHaveLength(0);
  });

  it("ignores events that have already passed (radar is forward-looking)", () => {
    const events = [
      ev({ id: "1", member: "Leo", start: "2026-06-10T17:00:00Z", end: "2026-06-10T18:00:00Z", location: "Field A" }),
      ev({ id: "2", member: "Mia", start: "2026-06-10T17:30:00Z", end: "2026-06-10T18:30:00Z", location: "Pool B" }),
    ];
    expect(detectConflicts(events, NOW)).toHaveLength(0);
  });
});
