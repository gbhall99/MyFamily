import { describe, it, expect } from "vitest";
import { summariseActionItems, draftGate, type Message } from "../src/comms.js";

describe("Thread summarisation (AC-P9)", () => {
  const thread: Message[] = [
    { from: "Coach", body: "Great game everyone!" },
    { from: "Coach", body: "Please bring shin pads on Thursday." },
    { from: "Parent", body: "Can you RSVP for the team dinner by Friday?" },
    { from: "Parent", body: "lol same" },
  ];

  it("returns every real action item and nothing fabricated", () => {
    const items = summariseActionItems(thread);
    expect(items).toHaveLength(2);
    // every returned item is verbatim from the thread (no invented commitments)
    for (const it of items) expect(thread.some((m) => m.body.trim() === it.body)).toBe(true);
  });

  it("ignores pure chatter", () => {
    const items = summariseActionItems(thread);
    expect(items.some((i) => /lol same/.test(i.body))).toBe(false);
  });
});

describe("Outgoing draft gate (AC-P10)", () => {
  it("requires approval except at full-auto", () => {
    expect(draftGate("notify").requiresApproval).toBe(true);
    expect(draftGate("suggest").requiresApproval).toBe(true);
    expect(draftGate("auto_undo").requiresApproval).toBe(true);
    expect(draftGate("full_auto").requiresApproval).toBe(false);
  });
});
