import { describe, it, expect } from "vitest";
import {
  AUTONOMY_LEVELS,
  actsAutomatically,
  interruptsForApproval,
  consequenceCopy,
} from "../src/autonomy.js";

describe("Autonomy ladder (AC-P14, AC-DA7)", () => {
  it("Notify never acts", () => {
    expect(actsAutomatically("notify")).toBe(false);
  });

  it("Full-auto acts but never interrupts", () => {
    expect(actsAutomatically("full_auto")).toBe(true);
    expect(interruptsForApproval("full_auto")).toBe(false);
  });

  it("Suggest is the only level that interrupts for approval", () => {
    const interrupting = AUTONOMY_LEVELS.filter(interruptsForApproval);
    expect(interrupting).toEqual(["suggest"]);
  });

  it("every level has unmistakable plain-language consequence copy", () => {
    for (const level of AUTONOMY_LEVELS) {
      expect(consequenceCopy(level).length).toBeGreaterThan(0);
    }
  });
});
