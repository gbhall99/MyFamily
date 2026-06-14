import { describe, it, expect } from "vitest";
import { decide, actAutonomously, type Suggestion } from "../src/approve.js";
import type { ActivityEntry } from "../src/activityLog.js";

function makeSuggestion(state: { applied: boolean }): Suggestion {
  return {
    id: "swim-moved",
    summary: "Move swim to Thursdays 5:00 PM",
    reason: "from the team email",
    category: "calendar",
    apply: () => {
      state.applied = true;
    },
    revert: () => {
      state.applied = false;
    },
  };
}

describe("Approve / Decision interaction (AC-DA4, AC-DA5, AC-G5, AC-P15)", () => {
  it("accepts in a single call, applies the effect, and exposes a visible undo", () => {
    const state = { applied: false };
    const log: ActivityEntry[] = [];
    const r = decide(makeSuggestion(state), "accept", log);

    expect(r.acted).toBe(true);
    expect(state.applied).toBe(true); // effect applied
    expect(typeof r.undo).toBe("function"); // undo immediately available
    expect(log).toHaveLength(1); // action is logged...
    expect(log[0]!.reason).toBe("from the team email"); // ...with a plain-language reason
  });

  it("undo reverses the effect and is recorded on the log entry", () => {
    const state = { applied: false };
    const log: ActivityEntry[] = [];
    const r = decide(makeSuggestion(state), "accept", log);
    r.undo!();
    expect(state.applied).toBe(false);
    expect(log[0]!.undoneAt).toBeTypeOf("number");
  });

  it("edit and decline are non-destructive: nothing is applied or logged", () => {
    for (const decision of ["edit", "decline"] as const) {
      const state = { applied: false };
      const log: ActivityEntry[] = [];
      const r = decide(makeSuggestion(state), decision, log);
      expect(r.acted).toBe(false);
      expect(state.applied).toBe(false);
      expect(log).toHaveLength(0);
    }
  });

  it("autonomous action still logs + stays undoable; never acts below auto levels", () => {
    const log: ActivityEntry[] = [];
    expect(actAutonomously(makeSuggestion({ applied: false }), "notify", log)).toBeNull();
    expect(actAutonomously(makeSuggestion({ applied: false }), "suggest", log)).toBeNull();
    expect(log).toHaveLength(0);

    const state = { applied: false };
    const r = actAutonomously(makeSuggestion(state), "full_auto", log);
    expect(r?.acted).toBe(true);
    expect(state.applied).toBe(true);
    expect(log).toHaveLength(1); // even silent auto-actions are logged
    expect(typeof r?.undo).toBe("function");
  });
});
