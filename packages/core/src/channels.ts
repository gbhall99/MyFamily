/**
 * Whole-family reach (SPEC §6, AC-G2). Any non-primary member can receive output
 * WITHOUT setup and WITHOUT an in-app account — the app falls back to SMS /
 * WhatsApp / email. No feature may assume "everyone is logged in."
 */
export type ContactMethod = "push" | "sms" | "whatsapp" | "email";

export interface FamilyMember {
  name: string;
  hasApp: boolean;
  contacts: ContactMethod[];
}

const FALLBACK_ORDER: ContactMethod[] = ["sms", "whatsapp", "email"];

/** Best channel to reach a member right now, or null if genuinely unreachable. */
export function reachChannel(m: FamilyMember): ContactMethod | null {
  if (m.hasApp && m.contacts.includes("push")) return "push";
  for (const c of FALLBACK_ORDER) if (m.contacts.includes(c)) return c;
  return null;
}

/** True only if every member — app or not — can be reached. */
export function everyoneReachable(members: FamilyMember[]): boolean {
  return members.every((m) => reachChannel(m) !== null);
}
