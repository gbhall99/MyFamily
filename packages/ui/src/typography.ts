/**
 * Typography scale guards (DESIGN_SPEC §4 / AC-DA3, AC-D3). Enforces that text
 * uses ONLY the defined type roles (no off-scale sizes) and that the system
 * supports Dynamic Type to 200%. Visual reflow at 200% still needs a visual/native
 * runner; the scale-mapping and scaling-support halves are checked here.
 */
import { type as typeRoles, maxFontScale } from "@myfamily/tokens";

export type TypeRoleName = keyof typeof typeRoles;
export const TYPE_ROLES = Object.keys(typeRoles) as TypeRoleName[];

export function isDefinedRole(role: string): role is TypeRoleName {
  return role in typeRoles;
}

/** Line height of a role at a given Dynamic-Type scale. */
export function scaledLineHeight(role: TypeRoleName, scale: number): number {
  return typeRoles[role].line * scale;
}

/** The system is required to scale to at least 200% (AC-D3 / AC-DA3). */
export function supportsDynamicTypeTo200(): boolean {
  return maxFontScale >= 2;
}
