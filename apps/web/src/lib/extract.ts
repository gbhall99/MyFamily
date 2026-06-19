/**
 * Capture intelligence (client). Turns pasted/typed text into a structured event.
 * Tries the serverless /api/extract route first (Groq-backed when GROQ_API_KEY is
 * set on the server); if that's unavailable it falls back to the deterministic
 * heuristic extractor from @myfamily/core, so capture always works offline.
 */
import { makeExtractor, type ExtractedEvent } from "@myfamily/core";

export const ROSTER = ["Maya", "Devin", "Leo", "Mia"];

export interface ExtractResult {
  event: ExtractedEvent;
  source: "model" | "on-device";
}

export async function extractEvent(text: string): Promise<ExtractResult> {
  try {
    const res = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, roster: ROSTER }),
    });
    if (res.ok) {
      const data = (await res.json()) as { event?: ExtractedEvent; source?: string };
      if (data.event) return { event: data.event, source: data.source === "model" ? "model" : "on-device" };
    }
  } catch {
    /* no serverless route / offline — fall back */
  }
  const event = await makeExtractor(ROSTER).extractEvent({ kind: "text", body: text });
  return { event, source: "on-device" };
}
