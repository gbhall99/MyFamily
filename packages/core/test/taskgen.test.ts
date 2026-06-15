import { describe, it, expect } from "vitest";
import { generateTasks, taskTitle, type Signal } from "../src/taskgen.js";

const DAY = 86_400_000;
const due = (days: number) => Date.now() + days * DAY;

const signals: Signal[] = [
  { kind: "rsvp", subject: "Leo's party", due: due(7), assignTo: "Maya" },
  { kind: "gift", subject: "Leo's party", due: due(7), assignTo: "Devin" },
  { kind: "renewal", subject: "passport", due: due(180), assignTo: "Maya" },
];

describe("Auto-task generation (AC-P22)", () => {
  it("creates dated, assigned tasks with lead-time reminders", () => {
    const tasks = generateTasks(signals);
    expect(tasks).toHaveLength(3);
    const rsvp = tasks.find((t) => t.source === "rsvp")!;
    expect(rsvp.title).toBe("RSVP to Leo's party");
    expect(rsvp.assignee).toBe("Maya");
    expect(rsvp.remindAt).toBeLessThan(rsvp.due); // reminded ahead of the deadline
    const renewal = tasks.find((t) => t.source === "renewal")!;
    expect(renewal.due - renewal.remindAt).toBe(60 * DAY); // 60-day lead for renewals
  });

  it("never duplicates a task the family already has", () => {
    const existing = [{ title: taskTitle(signals[0]!) }]; // "RSVP to Leo's party" already exists
    const tasks = generateTasks(signals, existing);
    expect(tasks.some((t) => t.source === "rsvp")).toBe(false);
    expect(tasks).toHaveLength(2);
  });

  it("de-duplicates identical signals within one batch", () => {
    const dup = [signals[0]!, signals[0]!];
    expect(generateTasks(dup)).toHaveLength(1);
  });
});
