import { describe, it, expect } from "vitest";
import { makeGroqExtractor, type ChatClient } from "../src/providers/groq.js";
import { fieldAccuracy } from "../src/extractor.js";
import { capture } from "../src/capture.js";
import { EXTRACTION_CASES, ROSTER, type Expected } from "./fixtures/extractionCases.js";

/**
 * OFFLINE test of the Groq extractor's prompt/parse plumbing. A fake ChatClient
 * returns the JSON a well-behaved model would, so this runs deterministically in
 * the main CI gate with no network/secret. The LIVE accuracy number is produced
 * by tooling/eval-extractor.ts in the separate eval workflow.
 */
function fakeClientFor(expected: Map<string, Expected>): ChatClient {
  return {
    async complete({ user }) {
      const found = [...expected.entries()].find(([body]) => user.includes(body));
      const e = found?.[1];
      if (!e) return "{}";
      return JSON.stringify({ ...e, confidence: 0.95 });
    },
  };
}

describe("Groq extractor (offline plumbing, AC-P1)", () => {
  const byBody = new Map<string, Expected>();
  for (const c of EXTRACTION_CASES) {
    const body = c.input.kind === "email" ? c.input.body : c.input.kind === "text" ? c.input.body : "";
    byBody.set(body, c.expected);
  }
  const extractor = makeGroqExtractor(fakeClientFor(byBody), ROSTER);

  it("parses well-formed model JSON into structured events at full accuracy", async () => {
    expect(await fieldAccuracy(extractor, EXTRACTION_CASES)).toBe(1);
  });

  it("feeds the capture pipeline (confident extraction is filed)", async () => {
    const r = await capture(EXTRACTION_CASES[0]!.input, extractor);
    expect(r.status).toBe("filed");
  });

  it("defers safely on malformed model output (never throws)", async () => {
    const broken: ChatClient = { async complete() { return "not json"; } };
    const got = await makeGroqExtractor(broken, ROSTER).extractEvent({ kind: "text", body: "x" });
    expect(got.confidence).toBe(0);
  });
});
