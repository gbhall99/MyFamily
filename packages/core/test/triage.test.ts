import { describe, it, expect } from "vitest";
import { evaluate, isActionItem, type InboxItem } from "../src/triage.js";

const I = (subject: string, body = ""): InboxItem => ({ subject, body });

// Small labelled corpus (scaffold). Real AC-P11 uses a large real corpus + model.
const corpus: { item: InboxItem; actionable: boolean }[] = [
  { item: I("Permission slip for zoo trip", "sign and return by Friday"), actionable: true },
  { item: I("Please RSVP for the bake sale"), actionable: true },
  { item: I("Soccer registration due next week"), actionable: true },
  { item: I("Bring a packed lunch Thursday"), actionable: true },
  { item: I("Payment for school photos"), actionable: true },
  { item: I("Newsletter: this week at school", "Lots happening!"), actionable: false },
  { item: I("Thank you to our volunteers"), actionable: false },
  { item: I("Photo gallery from sports day"), actionable: false },
  { item: I("Principal's weekly note"), actionable: false },
  { item: I("Reminder: school is closed for holiday"), actionable: false },
];

describe("Inbox triage metric harness (AC-P11)", () => {
  it("recalls ≥90% of true action items", () => {
    expect(evaluate(corpus).recall).toBeGreaterThanOrEqual(0.9);
  });

  it("false-escalation rate ≤ 1 in 20 (0.05)", () => {
    expect(evaluate(corpus).falseEscalationRate).toBeLessThanOrEqual(0.05);
  });

  it("flags a clear action item and ignores clear chatter", () => {
    expect(isActionItem(I("RSVP needed"))).toBe(true);
    expect(isActionItem(I("Have a lovely weekend"))).toBe(false);
  });
});
