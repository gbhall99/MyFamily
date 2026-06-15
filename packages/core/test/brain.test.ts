import { describe, it, expect } from "vitest";
import { applyObservation, type Fact, type FactChange } from "../src/brain.js";

function setup() {
  const facts = new Map<string, Fact>();
  const changelog: FactChange[] = [];
  return { facts, changelog };
}

describe("Family Brain self-maintenance (AC-P20)", () => {
  it("creates a fact it didn't know", () => {
    const { facts, changelog } = setup();
    const r = applyObservation(facts, changelog, { key: "leo.swim.day", value: "Tuesday", source: "team email", confidence: 0.95 });
    expect(r.action).toBe("created");
    expect(facts.get("leo.swim.day")?.value).toBe("Tuesday");
  });

  it("is a no-op when the observation matches the known value", () => {
    const { facts, changelog } = setup();
    applyObservation(facts, changelog, { key: "leo.swim.day", value: "Tuesday", source: "a", confidence: 0.95 });
    const r = applyObservation(facts, changelog, { key: "leo.swim.day", value: "Tuesday", source: "b", confidence: 0.9 });
    expect(r.action).toBe("unchanged");
    expect(changelog).toHaveLength(0);
  });

  it("updates a confident change WITH a recorded trace (never silent)", () => {
    const { facts, changelog } = setup();
    applyObservation(facts, changelog, { key: "leo.swim.day", value: "Tuesday", source: "old", confidence: 0.95 });
    const r = applyObservation(facts, changelog, { key: "leo.swim.day", value: "Thursday", source: "team email", confidence: 0.92, at: 123 });
    expect(r.action).toBe("updated");
    expect(facts.get("leo.swim.day")?.value).toBe("Thursday");
    expect(changelog).toEqual([{ key: "leo.swim.day", from: "Tuesday", to: "Thursday", source: "team email", at: 123 }]);
  });

  it("FLAGS an ambiguous (low-confidence) change instead of overwriting", () => {
    const { facts, changelog } = setup();
    applyObservation(facts, changelog, { key: "leo.swim.day", value: "Tuesday", source: "old", confidence: 0.95 });
    const r = applyObservation(facts, changelog, { key: "leo.swim.day", value: "Wednesday", source: "a guess", confidence: 0.4 });
    expect(r.action).toBe("flagged");
    expect(facts.get("leo.swim.day")?.value).toBe("Tuesday"); // unchanged
    expect(changelog).toHaveLength(0); // no silent overwrite
  });
});
