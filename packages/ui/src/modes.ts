/**
 * Age/role UI modes (DESIGN_SPEC §12 / AC-DA12). One design system, modulated by
 * role — never a fork. Modes differ in density, base type size, tone, and which
 * actions are exposed, but every mode shares the SAME accessibility floor and the
 * SAME colour semantics. No mode may drop below AA.
 */
import { minTouchTarget } from "@myfamily/tokens";

export type ModeName = "kid" | "teen" | "adult" | "grandparent";

/** The accessibility floor — one shared, frozen object referenced by every mode. */
export const A11Y_FLOOR = Object.freeze({
  minTouchTargetIos: minTouchTarget.ios,
  minTouchTargetAndroid: minTouchTarget.android,
  minContrastText: 4.5,
  minContrastUi: 3,
});

export interface ModeConfig {
  density: number; // spacing multiplier
  baseTextSize: number; // pt — never below the floor
  tone: "encouraging" | "respectful" | "plain" | "warm-large";
  exposedActions: string[];
  a11yFloor: typeof A11Y_FLOOR;
}

const MIN_BASE_TEXT = 15;

export const MODES: Record<ModeName, ModeConfig> = {
  kid: { density: 1.3, baseTextSize: 18, tone: "encouraging", exposedActions: ["view", "complete"], a11yFloor: A11Y_FLOOR },
  teen: { density: 1.0, baseTextSize: 16, tone: "respectful", exposedActions: ["view", "complete", "propose"], a11yFloor: A11Y_FLOOR },
  adult: { density: 1.0, baseTextSize: 15, tone: "plain", exposedActions: ["view", "complete", "propose", "approve", "configure"], a11yFloor: A11Y_FLOOR },
  grandparent: { density: 1.25, baseTextSize: 18, tone: "warm-large", exposedActions: ["view", "complete", "approve"], a11yFloor: A11Y_FLOOR },
};

/** True if a mode keeps the shared a11y floor and stays at/above the AA text minimum. */
export function modeMeetsFloor(mode: ModeName): boolean {
  const c = MODES[mode];
  return c.a11yFloor === A11Y_FLOOR && c.baseTextSize >= MIN_BASE_TEXT;
}
