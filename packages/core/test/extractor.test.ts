import { describe, it, expect } from "vitest";
import { makeExtractor, fieldAccuracy } from "../src/extractor.js";
import { capture } from "../src/capture.js";
import type { CaptureInput, ExtractedEvent } from "../src/agent.js";

const ROSTER = ["Leo", "Mia", "Ava", "Noah"];
const extractor = makeExtractor(ROSTER);

type Expected = Omit<ExtractedEvent, "confidence">;
const cases: { input: CaptureInput; expected: Expected }[] = [
  {
    input: { kind: "text", body: "Leo's swim practice on Thursday at 5pm at Aquatic Centre" },
    expected: { title: "Leo's swim practice", date: "thursday", time: "17:00", location: "Aquatic Centre", child: "Leo" },
  },
  {
    input: { kind: "email", subject: "School trip", body: "Permission slip due June 18. Bring snacks." },
    expected: { title: "School trip", date: "2026-06-18", time: null, location: null, child: null },
  },
  {
    input: { kind: "text", body: "Mia ballet recital Jun 20 7:30pm" },
    expected: { title: "Mia ballet recital", date: "2026-06-20", time: "19:30", location: null, child: "Mia" },
  },
  {
    input: { kind: "text", body: "Noah football training @Riverside Park" },
    expected: { title: "Noah football training", date: null, time: null, location: "Riverside Park", child: "Noah" },
  },
  {
    input: { kind: "text", body: "Leo orthodontist on 3 Jul at 2:15pm at City Dental" },
    expected: { title: "Leo orthodontist", date: "2026-07-03", time: "14:15", location: "City Dental", child: "Leo" },
  },
];

describe("Heuristic event extractor accuracy (AC-P1)", () => {
  it("achieves ≥90% field accuracy across the labelled set", async () => {
    const acc = await fieldAccuracy(extractor, cases);
    expect(acc).toBeGreaterThanOrEqual(0.9);
  });

  it("feeds the capture pipeline so a confident extraction is filed", async () => {
    const r = await capture(cases[0]!.input, extractor);
    expect(r.status).toBe("filed");
    if (r.status === "filed") {
      expect(r.event.location).toBe("Aquatic Centre");
      expect(r.event.time).toBe("17:00");
    }
  });
});
