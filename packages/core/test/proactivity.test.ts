import { describe, it, expect } from "vitest";
import { surfaceProactive, proactivityRecall, type FamilyState } from "../src/proactivity.js";

const quiet: FamilyState = { conflicts: 0, permissionSlipsDue: 0, loadImbalanceRatio: 1.1, mealGapsThisWeek: 0, unreadActionItems: 0 };

const scenarios: { state: FamilyState; shouldSurface: boolean }[] = [
  { state: { ...quiet, conflicts: 1 }, shouldSurface: true },
  { state: { ...quiet, permissionSlipsDue: 2 }, shouldSurface: true },
  { state: { ...quiet, loadImbalanceRatio: 2.4 }, shouldSurface: true },
  { state: { ...quiet, mealGapsThisWeek: 3 }, shouldSurface: true },
  { state: { ...quiet, unreadActionItems: 4 }, shouldSurface: true },
  { state: { ...quiet, conflicts: 2, permissionSlipsDue: 1 }, shouldSurface: true },
  { state: quiet, shouldSurface: false },
];

describe("Proactivity engine (AC-G4)", () => {
  it("surfaces in ≥70% of relevant cases", () => {
    expect(proactivityRecall(scenarios)).toBeGreaterThanOrEqual(0.7);
  });

  it("stays silent when nothing is relevant (no nagging)", () => {
    expect(surfaceProactive(quiet)).toHaveLength(0);
  });

  it("explains every surfacing in plain language", () => {
    const out = surfaceProactive({ ...quiet, conflicts: 1, mealGapsThisWeek: 2 });
    expect(out.length).toBe(2);
    for (const s of out) expect(s.reason.length).toBeGreaterThan(0);
  });
});
