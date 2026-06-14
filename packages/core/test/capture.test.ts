import { describe, it, expect } from "vitest";
import { capture, resolveProvider, normaliseName, type Provider } from "../src/capture.js";
import type { CaptureInput, EventExtractor, ExtractedEvent } from "../src/agent.js";

const extractorReturning = (e: ExtractedEvent): EventExtractor => ({
  extractEvent: async (_: CaptureInput) => e,
});

const base: ExtractedEvent = {
  title: "Swim practice",
  date: "2026-06-18",
  time: "17:00",
  location: "Aquatic Centre",
  child: "Leo",
  confidence: 0.95,
};

describe("Universal capture pipeline (AC-G3, AC-G9)", () => {
  it("files a confident, complete extraction", async () => {
    const r = await capture({ kind: "text", body: "Swim Thu 5pm" }, extractorReturning(base));
    expect(r.status).toBe("filed");
  });

  it("defers to human review when confidence is below threshold (never acts wrongly)", async () => {
    const r = await capture({ kind: "text", body: "??" }, extractorReturning({ ...base, confidence: 0.4 }));
    expect(r.status).toBe("needs_review");
  });

  it("defers when an essential field (date) is missing", async () => {
    const r = await capture({ kind: "text", body: "Swim" }, extractorReturning({ ...base, date: null }));
    expect(r.status).toBe("needs_review");
  });
});

describe("Provider entity resolution (AC-P2)", () => {
  const known: Provider[] = [{ id: "prov_lee", name: "Dr. Lee", kind: "dentist" }];

  it("matches the same provider written two ways instead of duplicating", () => {
    expect(normaliseName("Dr. Lee")).toBe(normaliseName("Lee Dental Practice"));
    const r = resolveProvider({ name: "Lee Dental Practice", kind: "dentist" }, known);
    expect(r.action).toBe("matched");
  });

  it("creates a genuinely new, unrelated provider", () => {
    const r = resolveProvider({ name: "Bright Smiles", kind: "dentist" }, known);
    expect(r.action).toBe("created");
  });

  it("flags ambiguity rather than silently picking", () => {
    const two: Provider[] = [
      { id: "a", name: "Riverside Dental", kind: "dentist" },
      { id: "b", name: "Riverside Family Dental", kind: "dentist" },
    ];
    const r = resolveProvider({ name: "Riverside", kind: "dentist" }, two);
    expect(r.action).toBe("ambiguous");
  });
});
