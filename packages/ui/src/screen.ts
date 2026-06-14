/**
 * Declarative screen-spec model + automated design audits. Screens are described
 * as token-referencing node trees; the renderer consumes the same spec. Auditing
 * the spec gives screen-level evidence for AC-D1 (contrast), AC-D2 (touch
 * targets), AC-D6 (state coverage), AC-D9 / AC-DA2 (colour independence) without
 * needing a native runtime.
 */
import { themes, type SemanticColors, type ThemeName, minTouchTarget, type as typeRoles, wcag } from "@myfamily/tokens";

type ColorToken = keyof SemanticColors;
type TypeRole = keyof typeof typeRoles;

export type Node =
  | { type: "container"; bg: ColorToken; children: Node[] }
  | { type: "text"; role: TypeRole; fg: ColorToken; bg: ColorToken; text: string }
  | { type: "control"; label: string; minTarget: number; emphasis: "primary" | "secondary" | "destructive"; fg: ColorToken; bg: ColorToken }
  | { type: "memberIdentity"; accentIndex: number; bg: ColorToken; hasInitial: boolean }
  | { type: "status"; fg: ColorToken; bg: ColorToken; hasNonColorCue: boolean };

export interface ScreenSpec {
  name: string;
  states: ("default" | "loading" | "empty" | "error")[];
  root: Node;
}

const REQUIRED_STATES = ["default", "loading", "empty", "error"] as const;
const LARGE_MIN_SIZE = 22; // ≥ this is "large text" → 3:1 floor (DESIGN_SPEC §10)

function flatten(node: Node, out: Node[] = []): Node[] {
  out.push(node);
  if (node.type === "container") for (const c of node.children) flatten(c, out);
  return out;
}

export interface Violation {
  screen: string;
  ac: string;
  detail: string;
}

/** Run all screen audits for a theme. Empty array = passes. */
export function auditScreen(spec: ScreenSpec, theme: ThemeName): Violation[] {
  const t = themes[theme];
  const v: Violation[] = [];
  const nodes = flatten(spec.root);
  const hex = (k: ColorToken) => t[k];

  // AC-D6 — every screen declares the full state set.
  for (const s of REQUIRED_STATES) {
    if (!spec.states.includes(s)) v.push({ screen: spec.name, ac: "AC-D6", detail: `missing ${s} state` });
  }

  for (const n of nodes) {
    if (n.type === "text") {
      const ratio = wcag.contrastRatio(hex(n.fg), hex(n.bg));
      const floor = typeRoles[n.role].size >= LARGE_MIN_SIZE ? 3 : 4.5;
      if (ratio < floor) v.push({ screen: spec.name, ac: "AC-D1", detail: `text "${n.text}" ${ratio.toFixed(2)}:1 < ${floor}` });
    }
    if (n.type === "control") {
      if (n.minTarget < minTouchTarget.ios) v.push({ screen: spec.name, ac: "AC-D2", detail: `control "${n.label}" target ${n.minTarget} < 44` });
      if (wcag.contrastRatio(hex(n.fg), hex(n.bg)) < 3) v.push({ screen: spec.name, ac: "AC-D1", detail: `control "${n.label}" label contrast < 3` });
    }
    if (n.type === "memberIdentity") {
      // AC-DA2 / AC-D9 — identity colour must be paired with a non-colour cue (the initial).
      if (!n.hasInitial) v.push({ screen: spec.name, ac: "AC-DA2", detail: "member identity without an initial (colour-only)" });
      if (wcag.contrastRatio(accent(theme, n.accentIndex), hex(n.bg)) < 3) v.push({ screen: spec.name, ac: "AC-D1", detail: "member accent < 3:1 on surface" });
    }
    if (n.type === "status") {
      if (!n.hasNonColorCue) v.push({ screen: spec.name, ac: "AC-D9", detail: "status conveyed by colour alone" });
    }
  }
  return v;
}

import { memberAccents } from "@myfamily/tokens";
function accent(theme: ThemeName, i: number): `#${string}` {
  const set = theme === "light" ? memberAccents.light : memberAccents.dark;
  return set[i % set.length]!;
}
