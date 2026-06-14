/**
 * MyFamily color tokens — the single source of truth (DESIGN_SPEC §3).
 *
 * Architecture: raw `primitive` ramps are mapped into `semantic` tokens that
 * components consume. Components must NEVER reference a primitive or a raw hex
 * directly (enforced by tooling/token-lint.mjs → AC-D7 / AC-DG3).
 *
 * Values are "proposed — pending brand review" (DESIGN_SPEC preamble); the token
 * architecture and the contrast/colour-independence rules are binding.
 */

export type Hex = `#${string}`;

/** Raw palette — never consumed directly by UI. */
const primitive = {
  brand600: "#2E7D8A",
  brand400: "#5FB5C4",
  warmBg: "#FBFAF8",
  white: "#FFFFFF",
  ink: "#1C1B1A",
  ink70: "#5B5954",
  ink45: "#6B6862",
  line: "#E4E1DB",
  lineStrong: "#CFCBC3",
  darkBg: "#15171A",
  darkSurface: "#1E2125",
  darkInk: "#F2F1EE",
  darkInk70: "#B9B6AF",
  darkLine: "#33373C",
  success: "#2F8F5B",
  warn: "#B8860B",
  danger: "#C0492F",
} satisfies Record<string, Hex>;

/** Per-theme semantic token shape. Components consume only these. */
export interface SemanticColors {
  bg: Hex;
  surface: Hex;
  surfaceRaised: Hex;
  text: Hex;
  textSecondary: Hex;
  textMuted: Hex;
  textOnBrand: Hex;
  brand: Hex;
  border: Hex;
  borderStrong: Hex;
  statusSuccess: Hex;
  statusWarn: Hex;
  statusDanger: Hex;
  statusInfo: Hex;
}

export const light: SemanticColors = {
  bg: primitive.warmBg,
  surface: primitive.white,
  surfaceRaised: primitive.white,
  text: primitive.ink,
  textSecondary: primitive.ink70,
  textMuted: primitive.ink45,
  textOnBrand: primitive.white,
  brand: primitive.brand600,
  border: primitive.line,
  borderStrong: primitive.lineStrong,
  statusSuccess: primitive.success,
  statusWarn: primitive.warn,
  statusDanger: primitive.danger,
  statusInfo: primitive.brand600,
};

export const dark: SemanticColors = {
  bg: primitive.darkBg,
  surface: primitive.darkSurface,
  surfaceRaised: primitive.darkSurface,
  text: primitive.darkInk,
  textSecondary: primitive.darkInk70,
  textMuted: primitive.darkInk70,
  textOnBrand: primitive.darkBg,
  brand: primitive.brand400,
  border: primitive.darkLine,
  borderStrong: primitive.darkLine,
  statusSuccess: "#54B07E",
  statusWarn: "#D6A53A",
  statusDanger: "#E0795F",
  statusInfo: primitive.brand400,
};

export const themes = { light, dark } as const;
export type ThemeName = keyof typeof themes;

/**
 * Member accent colours (DESIGN_SPEC §3.3). Used as identity fills/indicators —
 * always paired with a non-colour cue (AC-D9 / AC-DA2). Per-theme sets so each
 * accent clears the ≥3:1 UI-contrast floor on its surface (a single hue cannot
 * clear 3:1 on both near-white and near-black). Ordered identically across
 * themes so member identity is stable. Chosen distinct in hue AND lightness so
 * they survive colour-blind simulation.
 */
export const memberAccents: { light: readonly Hex[]; dark: readonly Hex[] } = {
  light: [
    "#2F6FC0", // 1 blue
    "#C7701E", // 2 orange
    "#3E8C5E", // 3 green
    "#A8458F", // 4 magenta
    "#B43A22", // 5 red
    "#2A8F8F", // 6 teal
    "#543E3A", // 7 bronze (dark taupe — search-optimised for worst-case sim ΔE)
    "#4A3F95", // 8 violet (darker so it separates from blue under deutan)
  ],
  // Staggered in lightness (the axis that survives red-green blindness) so the
  // warm trio (orange/red/bronze) and the cool set stay separable under sim.
  dark: [
    "#8CC0F0", // 1 blue   (L*~76, light cyan-blue)
    "#F2B06A", // 2 orange (L*~78)
    "#4FB87E", // 3 green  (L*~67)
    "#D27CB8", // 4 magenta(L*~64)
    "#E0705A", // 5 red    (L*~60)
    "#2E8E8E", // 6 teal   (L*~52, darker cyan — separates from magenta/green under sim)
    "#8F6A34", // 7 bronze (L*~48)
    "#7A6FC8", // 8 violet (L*~51, blue-violet)
  ],
};

export { primitive as _primitiveDoNotConsume };
