import { describe, it, expect } from "vitest";
import { MODES, A11Y_FLOOR, modeMeetsFloor, type ModeName } from "../src/modes.js";

const ALL: ModeName[] = ["kid", "teen", "adult", "grandparent"];

describe("Age/role modes (AC-DA12)", () => {
  it("every mode shares the identical, unlowered a11y floor", () => {
    for (const m of ALL) {
      expect(MODES[m].a11yFloor).toBe(A11Y_FLOOR); // same reference, not a copy
      expect(modeMeetsFloor(m)).toBe(true);
    }
  });

  it("modes genuinely differ in density / type / tone / exposed actions", () => {
    const densities = new Set(ALL.map((m) => MODES[m].density));
    const tones = new Set(ALL.map((m) => MODES[m].tone));
    expect(densities.size).toBeGreaterThan(1);
    expect(tones.size).toBe(ALL.length);
    // kid sees fewer actions than adult; adult is the superset
    expect(MODES.kid.exposedActions.length).toBeLessThan(MODES.adult.exposedActions.length);
  });

  it("no mode drops its base text below the AA minimum", () => {
    for (const m of ALL) expect(MODES[m].baseTextSize).toBeGreaterThanOrEqual(15);
  });
});
