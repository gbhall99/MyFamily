import { describe, it, expect } from "vitest";
import { pseudoLocalize, fitsBudget } from "../src/localization.js";

describe("Localization readiness (AC-D11)", () => {
  it("pseudo-localizes by accenting and expanding ~40%", () => {
    const out = pseudoLocalize("Approve");
    expect(out.length).toBeGreaterThan("Approve".length); // expansion happened
    expect(out).toMatch(/[áéíóú]/i); // accented so missing translations are obvious
  });

  it("key UI labels still fit a generous label budget after expansion", () => {
    for (const label of ["Approve", "Edit", "Decline", "Undo", "Snap a photo", "Needs a tap"]) {
      expect(fitsBudget(label, 32)).toBe(true);
    }
  });
});
