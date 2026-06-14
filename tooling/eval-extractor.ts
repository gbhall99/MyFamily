/**
 * Live extraction-accuracy eval (AC-P1). Runs the Groq-backed extractor over the
 * labelled set and reports field accuracy. Reads GROQ_API_KEY from the env; if it
 * is absent the eval SKIPS (exit 0) so it never breaks CI when no secret is set.
 *
 *   GROQ_API_KEY=... pnpm eval:extractor
 */
import { createGroqClient, makeGroqExtractor } from "../packages/core/src/providers/groq.js";
import { fieldAccuracy } from "../packages/core/src/extractor.js";
import { EXTRACTION_CASES, ROSTER } from "../packages/core/test/fixtures/extractionCases.js";

const THRESHOLD = 0.9;

async function main() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log("eval-extractor: SKIPPED (no GROQ_API_KEY set).");
    return;
  }
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const extractor = makeGroqExtractor(createGroqClient({ apiKey, model }), ROSTER);

  const acc = await fieldAccuracy(extractor, EXTRACTION_CASES);
  console.log(`eval-extractor: model=${model} field accuracy = ${(acc * 100).toFixed(1)}% over ${EXTRACTION_CASES.length} cases`);

  if (acc < THRESHOLD) {
    console.error(`eval-extractor: BELOW THRESHOLD (${(THRESHOLD * 100).toFixed(0)}%) — AC-P1 not met by ${model}.`);
    process.exit(1);
  }
  console.log(`eval-extractor: PASS — AC-P1 field accuracy ≥ ${(THRESHOLD * 100).toFixed(0)}%.`);
}

main().catch((e) => {
  console.error("eval-extractor: ERROR", e);
  process.exit(1);
});
