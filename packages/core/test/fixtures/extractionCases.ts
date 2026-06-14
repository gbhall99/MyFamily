import type { CaptureInput, ExtractedEvent } from "../../src/agent.js";

export type Expected = Omit<ExtractedEvent, "confidence">;
export const ROSTER = ["Leo", "Mia", "Ava", "Noah"];

/** Labelled extraction cases — shared by the offline unit test and the live model eval. */
export const EXTRACTION_CASES: { input: CaptureInput; expected: Expected }[] = [
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
