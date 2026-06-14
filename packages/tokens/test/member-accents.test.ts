import { describe, it, expect } from "vitest";
import { memberAccents, light, dark, type Hex } from "../src/color.js";
import { contrastRatio, deltaE, simulate, colorBlindKinds } from "../src/wcag.js";

/**
 * Evidence for AC-DA2 (member accents distinguishable under colour-blindness +
 * ≥3:1 on surface). The "non-colour cue" half of AC-DA2 is enforced at the
 * member-chip component, so AC-DA2 stays IN-PROGRESS until that ships.
 */
const AA_UI = 3.0;
// Min CIE76 ΔE to call two swatches "distinguishable". ~2.3 = just noticeable;
// we require a comfortable margin in normal vision and under simulation.
const MIN_DELTA_NORMAL = 12;
// ~2.6× the ~2.3 ΔE just-noticeable-difference: a principled "clearly distinct"
// floor that must hold even under colour-blind simulation.
const MIN_DELTA_SIMULATED = 6;

function minPairwiseDelta(colors: readonly Hex[]): number {
  let min = Infinity;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      min = Math.min(min, deltaE(colors[i]!, colors[j]!));
    }
  }
  return min;
}

describe.each([
  ["light", memberAccents.light, light.surface],
  ["dark", memberAccents.dark, dark.surface],
])("member accents — %s theme", (_name, accents, surface) => {
  it("provides exactly 8 accents", () => {
    expect(accents).toHaveLength(8);
  });

  it("each accent ≥ 3:1 against the surface", () => {
    for (const a of accents) {
      expect(contrastRatio(a, surface as Hex)).toBeGreaterThanOrEqual(AA_UI);
    }
  });

  it("all mutually distinguishable in normal vision", () => {
    expect(minPairwiseDelta(accents)).toBeGreaterThanOrEqual(MIN_DELTA_NORMAL);
  });

  it.each(colorBlindKinds)("remain distinguishable under %s simulation", (kind) => {
    const simulated = accents.map((a) => simulate(a, kind));
    expect(minPairwiseDelta(simulated)).toBeGreaterThanOrEqual(MIN_DELTA_SIMULATED);
  });
});
