/**
 * Motion helper enforcing the reduced-motion contract (DESIGN_SPEC §7.5 / AC-D8):
 * every animated duration collapses to an instant when reduced motion is on, so
 * no meaning depends on animation.
 */
import { motion } from "@myfamily/tokens";

export type MotionToken = "fast" | "base" | "slow";

export function motionDuration(token: MotionToken, reduceMotion: boolean): number {
  return reduceMotion ? 0 : motion[token];
}
