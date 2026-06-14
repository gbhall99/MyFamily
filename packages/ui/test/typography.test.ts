import { describe, it, expect } from "vitest";
import { TYPE_ROLES, isDefinedRole, scaledLineHeight, supportsDynamicTypeTo200 } from "../src/typography.js";
import { allScreens } from "../src/screens.js";
import { motionDuration } from "../src/motion.js";
import { motion } from "@myfamily/tokens";

describe("Typography scale (AC-DA3, AC-D3)", () => {
  it("every screen's text uses a defined type role (no off-scale sizes)", () => {
    const walk = (node: unknown): void => {
      const n = node as { type?: string; role?: string; children?: unknown[] };
      if (n.type === "text" && n.role) expect(isDefinedRole(n.role)).toBe(true);
      n.children?.forEach(walk);
    };
    for (const s of allScreens) walk(s.root);
    expect(TYPE_ROLES.length).toBeGreaterThan(0);
  });

  it("supports Dynamic Type scaling to 200%, with line height scaling in step", () => {
    expect(supportsDynamicTypeTo200()).toBe(true);
    expect(scaledLineHeight("bodyL", 2)).toBe(scaledLineHeight("bodyL", 1) * 2);
  });
});

describe("Motion uses tokens and honours reduced motion (AC-DA8)", () => {
  it("animated durations come from the motion token set", () => {
    const tokenValues = [motion.fast, motion.base, motion.slow];
    for (const t of ["fast", "base", "slow"] as const) {
      expect(tokenValues).toContain(motionDuration(t, false));
    }
  });

  it("reduced motion collapses every duration to instant", () => {
    for (const t of ["fast", "base", "slow"] as const) expect(motionDuration(t, true)).toBe(0);
  });
});
