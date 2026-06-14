/** Non-colour design tokens (DESIGN_SPEC §4, §5, §7). Binding architecture. */

/** Spacing scale — 4pt base (DESIGN_SPEC §5). */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 } as const;

/** Corner radius tokens (DESIGN_SPEC §5). */
export const radius = { sm: 8, md: 12, lg: 20, pill: 999 } as const;

/** Motion tokens — durations (ms) and easing (DESIGN_SPEC §7.2). */
export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
  easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
  easeEmphasized: "cubic-bezier(0.2, 0, 0, 1.2)",
} as const;

/** Type roles & scale (DESIGN_SPEC §4.1). size/line in pt, weight numeric. */
export interface TypeRole {
  size: number;
  line: number;
  weight: 400 | 500 | 600 | 700;
}
export const type = {
  display: { size: 34, line: 40, weight: 700 },
  titleL: { size: 28, line: 34, weight: 700 },
  titleM: { size: 22, line: 28, weight: 600 },
  bodyL: { size: 17, line: 24, weight: 400 },
  bodyM: { size: 15, line: 22, weight: 400 },
  label: { size: 13, line: 18, weight: 500 },
  caption: { size: 12, line: 16, weight: 400 },
} satisfies Record<string, TypeRole>;

/** Minimum touch target (DESIGN_SPEC §10 / AC-D2): 44pt iOS, 48dp Android. */
export const minTouchTarget = { ios: 44, android: 48 } as const;

/** Max Dynamic Type scale that layouts must survive (AC-D3). */
export const maxFontScale = 2.0;
