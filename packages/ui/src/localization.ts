/**
 * Localization readiness (DESIGN_SPEC §10 / AC-D11). Pseudo-localization expands
 * copy ~40% and accents it so layouts can be checked for clipping before real
 * translation; a length budget catches strings that would overflow. (RTL mirroring
 * and visual no-clip verification still need a visual/native runner.)
 */
const ACCENTS: Record<string, string> = {
  a: "á", e: "é", i: "í", o: "ó", u: "ú", A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú",
};

export function pseudoLocalize(s: string): string {
  const accented = s.replace(/[aeiou]/gi, (m) => ACCENTS[m] ?? m);
  const pad = "·".repeat(Math.ceil(s.length * 0.4));
  return `⟦${accented}${pad}⟧`;
}

/** True if the string still fits a label budget after pseudo-localization. */
export function fitsBudget(s: string, maxChars: number): boolean {
  return pseudoLocalize(s).length <= maxChars;
}
