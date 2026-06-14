import { describe, it, expect } from "vitest";
import { assembleBrief, MAX_DECISIONS, type Decision } from "../src/brief.js";
import { computeLoad, includesCognitiveLoad, nextAssignee, type Task } from "../src/fairshare.js";
import { canAccess, teenBoundaryHonoured, visibleOnFamilyDisplay } from "../src/access.js";
import { routeNotification, netDefaultPushes, type Notifiable } from "../src/notify.js";

describe("Daily Brief assembler (AC-P16, AC-DA6)", () => {
  it("never shows more than 3 decisions and keeps the highest priority", () => {
    const decisions: Decision[] = [1, 2, 3, 4, 5].map((p) => ({ id: `d${p}`, prompt: `q${p}`, priority: p }));
    const brief = assembleBrief({ logistics: ["School run 8:15"], conflicts: [], decisions, handled: ["Booked dentist"] });
    expect(brief.decisions.length).toBeLessThanOrEqual(MAX_DECISIONS);
    expect(brief.decisions[0]!.priority).toBe(5); // highest kept
    expect(brief.deferredDecisionCount).toBe(2);
  });

  it("includes the four canonical sections", () => {
    const brief = assembleBrief({ logistics: ["a"], conflicts: [], decisions: [], handled: ["b"] });
    expect(brief.logistics).toBeDefined();
    expect(brief.conflicts).toBeDefined();
    expect(brief.decisions).toBeDefined();
    expect(brief.handled).toBeDefined();
  });
});

describe("Fair-Share load engine (AC-P5, AC-P6)", () => {
  const tasks: Task[] = [
    { id: "1", assignee: "Maya", effort: 3, kind: "physical" },
    { id: "2", assignee: "Maya", effort: 4, kind: "cognitive" }, // anticipatory work counted
    { id: "3", assignee: "Devin", effort: 2, kind: "physical" },
  ];

  it("counts anticipatory/cognitive load, not just chores", () => {
    const load = computeLoad(tasks, ["Maya", "Devin"]);
    expect(includesCognitiveLoad(load)).toBe(true);
    expect(load.byMember.Maya!.cognitive).toBe(4);
  });

  it("routes the next task to the under-loaded member", () => {
    const load = computeLoad(tasks, ["Maya", "Devin"]); // Maya 7, Devin 2
    expect(nextAssignee(load)).toBe("Devin");
  });
});

describe("Role-scoped access + Family-Display (AC-P17, AC-P18, AC-P19, AC-DA11)", () => {
  it("scopes sensitive data by role", () => {
    expect(canAccess("parent", "financial")).toBe(true);
    expect(canAccess("grandparent", "financial")).toBe(false);
    expect(canAccess("child", "health")).toBe(false);
  });

  it("honours a teen's location boundary against silent override", () => {
    expect(teenBoundaryHonoured("parent", { shareLocation: false }, "location")).toBe(false);
    expect(teenBoundaryHonoured("teen", { shareLocation: false }, "location")).toBe(true);
  });

  it("hides financial/health/personal on the shared Family-Display", () => {
    expect(visibleOnFamilyDisplay("financial")).toBe(false);
    expect(visibleOnFamilyDisplay("health")).toBe(false);
    expect(visibleOnFamilyDisplay("general")).toBe(true);
  });
});

describe("Calm notification budget (AC-G6, AC-D12)", () => {
  it("pushes only urgent items; routine items defer to the Brief", () => {
    expect(routeNotification({ id: "1", urgency: "urgent" })).toBe("push");
    expect(routeNotification({ id: "2", urgency: "routine" })).toBe("brief");
  });

  it("adds zero net default pushes for a batch of routine items", () => {
    const routine: Notifiable[] = [1, 2, 3].map((n) => ({ id: `${n}`, urgency: "routine" as const }));
    expect(netDefaultPushes(routine)).toBe(0);
  });
});
