import { describe, it, expect } from "vitest";
import { light, dark, type SemanticColors, type Hex } from "../src/color.js";
import { contrastRatio } from "../src/wcag.js";

/**
 * Evidence for AC-D1 (contrast floor, light + dark) and AC-DA1 (semantic tokens
 * pass contrast) at the TOKEN level. Screen-level audits are added as screens land.
 * Floors from DESIGN_SPEC §10: text ≥ 4.5:1, UI/large ≥ 3:1.
 */
const AA_TEXT = 4.5;
const AA_UI = 3.0;

describe.each([
  ["light", light],
  ["dark", dark],
])("semantic colour contrast — %s theme", (_name, t: SemanticColors) => {
  it("primary/secondary/muted text ≥ 4.5:1 on bg and surface", () => {
    for (const surface of [t.bg, t.surface] as Hex[]) {
      for (const text of [t.text, t.textSecondary, t.textMuted] as Hex[]) {
        expect(contrastRatio(text, surface)).toBeGreaterThanOrEqual(AA_TEXT);
      }
    }
  });

  it("text-on-brand label ≥ 4.5:1 against brand", () => {
    expect(contrastRatio(t.textOnBrand, t.brand)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("status + brand indicators ≥ 3:1 on surface (UI/non-text contrast)", () => {
    for (const c of [t.statusSuccess, t.statusWarn, t.statusDanger, t.statusInfo, t.brand] as Hex[]) {
      expect(contrastRatio(c, t.surface)).toBeGreaterThanOrEqual(AA_UI);
    }
  });
});
