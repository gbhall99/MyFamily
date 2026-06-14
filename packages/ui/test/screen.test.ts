import { describe, it, expect } from "vitest";
import { auditScreen } from "../src/screen.js";
import { allScreens } from "../src/screens.js";
import { lintCopy, hasSingleClearAction } from "../src/content.js";

describe("Screen audits over real screens (AC-D1, AC-D2, AC-D6, AC-D9, AC-DA2)", () => {
  it.each(allScreens)("$name passes all audits in light + dark", (screen) => {
    expect(auditScreen(screen, "light")).toEqual([]);
    expect(auditScreen(screen, "dark")).toEqual([]);
  });

  it("catches a colour-only member identity (no initial)", () => {
    const bad = {
      name: "bad",
      states: ["default", "loading", "empty", "error"] as const,
      root: { type: "memberIdentity", accentIndex: 0, bg: "bg", hasInitial: false } as const,
    };
    const v = auditScreen({ ...bad, states: [...bad.states] }, "light");
    expect(v.some((x) => x.ac === "AC-DA2")).toBe(true);
  });

  it("catches a missing state, undersized target, and a primary outside the thumb zone", () => {
    const bad = {
      name: "bad",
      states: ["default"] as ("default" | "loading" | "empty" | "error")[],
      root: { type: "control", label: "x", minTarget: 30, emphasis: "primary", fg: "textOnBrand", bg: "brand", zone: "top" } as const,
    };
    const v = auditScreen(bad, "light");
    expect(v.some((x) => x.ac === "AC-D6")).toBe(true);
    expect(v.some((x) => x.ac === "AC-D2")).toBe(true);
    expect(v.some((x) => x.ac === "AC-D5")).toBe(true);
  });
});

describe("Content & tone lint (AC-DA13)", () => {
  it("flags guilt/urgency language", () => {
    expect(lintCopy("ALERT: you forgot the dentist!!").length).toBeGreaterThan(0);
  });

  it("passes calm, plain copy with a single next step", () => {
    const copy = "I found swim moved to Thursdays — update the calendar?";
    expect(lintCopy(copy)).toEqual([]);
    expect(hasSingleClearAction(copy)).toBe(true);
  });
});
