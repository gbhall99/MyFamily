/**
 * Real app screens described as token-based specs (DESIGN_SPEC §6). These are the
 * specs the renderer consumes; they are audited in tests so every screen carries
 * screen-level evidence for the design AC.
 */
import type { ScreenSpec } from "./screen.js";

/** The Today / Daily Brief home (DESIGN_SPEC §6.1, hero of the retention loop). */
export const todayScreen: ScreenSpec = {
  name: "Today / Daily Brief",
  states: ["default", "loading", "empty", "error"],
  root: {
    type: "container",
    bg: "bg",
    children: [
      { type: "text", role: "titleL", fg: "text", bg: "bg", text: "Good morning" },
      { type: "text", role: "bodyM", fg: "textSecondary", bg: "bg", text: "3 things need a tap · I handled 4" },
      { type: "memberIdentity", accentIndex: 0, bg: "bg", hasInitial: true },
      { type: "status", fg: "statusWarn", bg: "bg", hasNonColorCue: true },
      { type: "control", label: "Approve", minTarget: 48, emphasis: "primary", fg: "textOnBrand", bg: "brand", zone: "thumb" },
    ],
  },
};

/** The approval detail surface (hero one-tap Approve). */
export const approveScreen: ScreenSpec = {
  name: "Approve detail",
  states: ["default", "loading", "empty", "error"],
  root: {
    type: "container",
    bg: "surface",
    children: [
      { type: "text", role: "titleM", fg: "text", bg: "surface", text: "Swim practice moved" },
      { type: "text", role: "caption", fg: "textMuted", bg: "surface", text: "Thursdays 5:00 PM · from the team email" },
      { type: "control", label: "Approve", minTarget: 48, emphasis: "primary", fg: "textOnBrand", bg: "brand", zone: "thumb" },
      { type: "control", label: "Edit", minTarget: 48, emphasis: "secondary", fg: "brand", bg: "surface", zone: "thumb" },
    ],
  },
};

export const allScreens: ScreenSpec[] = [todayScreen, approveScreen];
