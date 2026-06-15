import { describe, it, expect } from "vitest";
import { dueWindows, type ChildWindow } from "../src/kids.js";
import { claimCare, completeCare, type CareItem } from "../src/care.js";

const DAY = 86_400_000;
const NOW = Date.parse("2026-06-15T00:00:00Z");

describe("Kids time-sensitive windows (AC-P26)", () => {
  const windows: ChildWindow[] = [
    { child: "Leo", title: "Summer camp registration", dueAt: NOW + 10 * DAY, leadDays: 21, assignTo: "Maya" }, // lead started
    { child: "Mia", title: "6-year well-visit", dueAt: NOW + 200 * DAY, leadDays: 30, assignTo: "Devin" }, // too far off
    { child: "Leo", title: "Swim gala sign-up", dueAt: NOW - 2 * DAY, leadDays: 14, assignTo: "Maya" }, // already past
  ];

  it("surfaces only windows within their lead time and not yet past, assigned to an adult", () => {
    const due = dueWindows(windows, NOW);
    expect(due.map((w) => w.title)).toEqual(["Summer camp registration"]);
    expect(due[0]!.assignTo).toBe("Maya");
    expect(due[0]!.surfaceAt).toBeLessThanOrEqual(NOW);
  });
});

describe("Eldercare shared log (AC-P32)", () => {
  function items(): Map<string, CareItem> {
    return new Map([
      ["meds", { id: "meds", what: "Give Dad his evening meds" }],
      ["appt", { id: "appt", what: "Take Mum to the cardiologist" }],
    ]);
  }

  it("prevents double-assignment (one owner per task)", () => {
    const m = items();
    expect(claimCare(m, "appt", "Sam")).toEqual({ ok: true });
    expect(claimCare(m, "appt", "Jo").ok).toBe(false); // already owned by Sam
    expect(m.get("appt")!.owner).toBe("Sam");
  });

  it("prevents duplication (a task is completed once)", () => {
    const m = items();
    expect(completeCare(m, "meds", "Sam", NOW)).toEqual({ ok: true });
    const second = completeCare(m, "meds", "Jo", NOW + 1000);
    expect(second.ok).toBe(false); // meds not given twice
    expect(m.get("meds")!.doneBy).toBe("Sam");
  });
});
