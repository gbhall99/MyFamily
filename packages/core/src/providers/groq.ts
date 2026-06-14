/**
 * Groq-backed event extractor (SPEC §6.1 / AC-P1). Implements the
 * provider-agnostic EventExtractor against Groq's OpenAI-compatible API. The HTTP
 * client is injected so the extraction prompt/parse logic is unit-testable OFFLINE
 * (a fake client), while the real network call lives only in `createGroqClient`
 * and runs in the eval workflow. The API key is read from the environment — never
 * hard-coded.
 */
import type { CaptureInput, EventExtractor, ExtractedEvent } from "../agent.js";

export interface ChatClient {
  complete(messages: { system: string; user: string }): Promise<string>;
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Real Groq client (OpenAI-compatible). Only used by the eval, not the test gate. */
export function createGroqClient(opts: { apiKey: string; model?: string; fetchImpl?: typeof fetch }): ChatClient {
  const model = opts.model ?? "llama-3.3-70b-versatile";
  const doFetch = opts.fetchImpl ?? fetch;
  return {
    async complete({ system, user }) {
      const res = await doFetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${opts.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) throw new Error(`Groq HTTP ${res.status}: ${await res.text()}`);
      const json = (await res.json()) as { choices: { message: { content: string } }[] };
      return json.choices[0]?.message.content ?? "";
    },
  };
}

const SYSTEM = [
  "You extract a SINGLE calendar event from short family text (a flyer, notice, message, or voice note).",
  "Return ONLY a JSON object with keys:",
  '  title (string), date (ISO "YYYY-MM-DD", or a lowercase weekday like "thursday", or null),',
  "  time (24h \"HH:MM\" or null), location (string or null),",
  "  child (exactly one roster name that appears, or null), confidence (number 0..1).",
  "Use the year 2026 for dates that omit a year. Do not invent fields that are not present.",
].join(" ");

const EMPTY: ExtractedEvent = { title: "", date: null, time: null, location: null, child: null, confidence: 0 };

function coerce(raw: string, roster: string[]): ExtractedEvent {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return EMPTY; // no JSON object → defer (confidence 0)
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(match[0]) as Record<string, unknown>;
  } catch {
    return EMPTY;
  }
  const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
  let date = str(obj.date);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) date = date.toLowerCase();
  const childRaw = str(obj.child);
  const child = childRaw ? roster.find((n) => n.toLowerCase() === childRaw.toLowerCase()) ?? null : null;
  const confidence = typeof obj.confidence === "number" ? Math.max(0, Math.min(1, obj.confidence)) : 0.5;
  return { title: str(obj.title) ?? "", date, time: str(obj.time), location: str(obj.location), child, confidence };
}

function inputText(input: CaptureInput): string {
  switch (input.kind) {
    case "photo":
      return input.ocrText ?? "";
    case "text":
      return input.body;
    case "email":
      return `Subject: ${input.subject}\n${input.body}`;
    case "voice":
      return input.transcript;
  }
}

export function makeGroqExtractor(client: ChatClient, roster: string[]): EventExtractor {
  return {
    async extractEvent(input: CaptureInput): Promise<ExtractedEvent> {
      const user = `Roster: ${roster.join(", ")}\nText: ${inputText(input)}`;
      const raw = await client.complete({ system: SYSTEM, user });
      return coerce(raw, roster);
    },
  };
}
