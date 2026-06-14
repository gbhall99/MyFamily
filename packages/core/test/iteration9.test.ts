import { describe, it, expect } from "vitest";
import { reachChannel, everyoneReachable, type FamilyMember } from "../src/channels.js";
import { DocStore, completeTask, type SlipTask } from "../src/documents.js";
import { planGoal } from "../src/planner.js";

describe("Whole-family reach (AC-G2)", () => {
  it("reaches a member with no app/account via SMS fallback", () => {
    const grandparent: FamilyMember = { name: "Nan", hasApp: false, contacts: ["sms"] };
    expect(reachChannel(grandparent)).toBe("sms");
  });

  it("prefers push for app members but never assumes everyone is logged in", () => {
    const family: FamilyMember[] = [
      { name: "Maya", hasApp: true, contacts: ["push", "sms"] },
      { name: "Nan", hasApp: false, contacts: ["whatsapp"] },
      { name: "Coach", hasApp: false, contacts: ["email"] },
    ];
    expect(reachChannel(family[0]!)).toBe("push");
    expect(everyoneReachable(family)).toBe(true);
  });

  it("flags a genuinely unreachable member rather than silently dropping them", () => {
    expect(reachChannel({ name: "X", hasApp: false, contacts: [] })).toBeNull();
  });
});

describe("Document retrieval + permission-slip tracking (AC-P12)", () => {
  it("retrieves the document at the point of need and tracks the task to completion", () => {
    const store = new DocStore();
    store.add({ id: "d1", title: "Zoo trip permission slip", text: "signed", tags: ["leo", "school"] });

    expect(store.search("permission slip")).toHaveLength(1);
    expect(store.search("leo")[0]!.id).toBe("d1");

    let task: SlipTask = { id: "t1", child: "Leo", docId: "d1", done: false };
    task = completeTask(task);
    expect(task.done).toBe(true);
  });
});

describe("Agentic planner (AC-P13)", () => {
  it("turns a goal into an approvable, editable plan covering all five areas", () => {
    const plan = planGoal("sort out Leo's party");
    expect(plan.editable).toBe(true);
    expect(plan.approvable).toBe(true);
    expect(plan.sections.map((s) => s.key)).toEqual(["date", "logistics", "invites", "tasks", "provisioning"]);
    expect(plan.subject.toLowerCase()).toContain("leo");
    for (const s of plan.sections) expect(s.items.length).toBeGreaterThan(0);
  });
});
