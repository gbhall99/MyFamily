/**
 * Presentational style descriptors built ENTIRELY from design tokens — the only
 * sanctioned way UI gets colour/spacing/type (AC-D7 / AC-DG3 / AC-DA1). Note
 * there is not a single raw hex in this file; everything resolves to a token.
 */
import { themes, space, radius, type as typeRoles, minTouchTarget, type ThemeName } from "@myfamily/tokens";

/** Style for the hero Approve button. Accept is brand-weight, never danger-weight (AC-DA4). */
export function approveButtonStyle(theme: ThemeName) {
  const t = themes[theme];
  return {
    backgroundColor: t.brand,
    color: t.textOnBrand,
    minHeight: minTouchTarget.ios, // ≥44pt (AC-D2)
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    fontSize: typeRoles.label.size,
    fontWeight: typeRoles.label.weight,
  } as const;
}

/** Secondary (edit/decline) — quieter than accept, and not styled as destructive. */
export function secondaryButtonStyle(theme: ThemeName) {
  const t = themes[theme];
  return {
    backgroundColor: t.surface,
    color: t.brand,
    borderColor: t.borderStrong,
    minHeight: minTouchTarget.ios,
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
  } as const;
}

/** Member identity chip — colour is ALWAYS paired with an initial (AC-D9 / AC-DA2). */
export function memberChipStyle(theme: ThemeName, accentIndex: number) {
  const accents = themes[theme] === themes.light ? lightAccents() : darkAccents();
  return {
    backgroundColor: accents[accentIndex % accents.length],
    initialRequired: true as const, // non-colour cue is mandatory
  };
}

import { memberAccents } from "@myfamily/tokens";
const lightAccents = () => memberAccents.light;
const darkAccents = () => memberAccents.dark;
