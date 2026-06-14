import { describe, it, expect } from "vitest";
import { USED_FOR_TRAINING, minimiseChildData, retentionDisclosed, type ChildRecord } from "../src/privacy.js";

describe("Privacy by default (AC-G8, AC-P17)", () => {
  it("never uses data for model training", () => {
    expect(USED_FOR_TRAINING).toBe(false);
  });

  it("minimises under-13 data to only what's necessary", () => {
    const child: ChildRecord = { name: "Leo", age: 8, necessary: { grade: 3 }, extra: { location: "home", device: "tablet" } };
    const min = minimiseChildData(child);
    expect(min.extra).toBeUndefined();
    expect(min.necessary).toEqual({ grade: 3 });
  });

  it("keeps non-child records intact", () => {
    const teen: ChildRecord = { name: "Mia", age: 15, necessary: {}, extra: { handle: "@mia" } };
    expect(minimiseChildData(teen).extra).toBeDefined();
  });

  it("discloses retention for every data type", () => {
    expect(retentionDisclosed()).toBe(true);
  });
});
