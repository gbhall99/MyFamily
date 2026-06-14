/**
 * Heuristic event extractor (SPEC §6.1 / AC-P1). A deterministic, offline
 * implementation of EventExtractor that parses common flyer/notice/text patterns
 * (title, date, time, location, child) so the capture pipeline works end-to-end
 * and its field accuracy is measurable without a model. A model-backed extractor
 * (provider-agnostic) replaces this for messy real-world OCR; the accuracy eval
 * harness stays.
 */
import type { CaptureInput, EventExtractor, ExtractedEvent } from "./agent.js";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const YEAR = 2026;

function text(input: CaptureInput): string {
  switch (input.kind) {
    case "photo":
      return input.ocrText ?? "";
    case "text":
      return input.body;
    case "email":
      return `${input.subject}. ${input.body}`;
    case "voice":
      return input.transcript;
  }
}

interface Match {
  value: string;
  raw: string; // the substring to strip from the title
}

function matchDate(s: string): Match | null {
  let m = s.match(/\b([A-Za-z]{3,9})\s+(\d{1,2})\b/);
  if (m) {
    const mi = MONTHS.indexOf(m[1]!.slice(0, 3).toLowerCase());
    if (mi >= 0) return { value: `${YEAR}-${String(mi + 1).padStart(2, "0")}-${m[2]!.padStart(2, "0")}`, raw: m[0] };
  }
  m = s.match(/\b(\d{1,2})\s+([A-Za-z]{3,9})\b/);
  if (m) {
    const mi = MONTHS.indexOf(m[2]!.slice(0, 3).toLowerCase());
    if (mi >= 0) return { value: `${YEAR}-${String(mi + 1).padStart(2, "0")}-${m[1]!.padStart(2, "0")}`, raw: m[0] };
  }
  m = s.match(/\b(\d{1,2})\/(\d{1,2})\b/);
  if (m) return { value: `${YEAR}-${m[2]!.padStart(2, "0")}-${m[1]!.padStart(2, "0")}`, raw: m[0] };
  for (const d of WEEKDAYS) {
    const w = s.match(new RegExp(`\\b${d}s?\\b`, "i"));
    if (w) return { value: d, raw: w[0] };
  }
  return null;
}

function matchTime(s: string): Match | null {
  const ampm = s.match(/\b(\d{1,2})(?::(\d{2}))?\s*([ap]m)\b/i);
  if (ampm) {
    let h = parseInt(ampm[1]!, 10) % 12;
    if (ampm[3]!.toLowerCase() === "pm") h += 12;
    return { value: `${String(h).padStart(2, "0")}:${ampm[2] ?? "00"}`, raw: ampm[0] };
  }
  const h24 = s.match(/\b([01]?\d|2[0-3]):(\d{2})\b/);
  if (h24) return { value: `${h24[1]!.padStart(2, "0")}:${h24[2]}`, raw: h24[0] };
  return null;
}

function matchLocation(s: string): Match | null {
  const m = s.match(/(?:\bat\b\s+|@\s*)([A-Z][\w'&]*(?:\s+[A-Z][\w'&]*)*)/);
  if (m && !/^\d/.test(m[1]!)) return { value: m[1]!.trim(), raw: m[0] };
  return null;
}

export const parseDate = (s: string): string | null => matchDate(s)?.value ?? null;
export const parseTime = (s: string): string | null => matchTime(s)?.value ?? null;
export const parseLocation = (s: string): string | null => matchLocation(s)?.value ?? null;

export function makeExtractor(roster: string[]): EventExtractor {
  return {
    async extractEvent(input: CaptureInput): Promise<ExtractedEvent> {
      const s = text(input).replace(/\s+/g, " ").trim();
      const d = matchDate(s);
      const ti = matchTime(s);
      const loc = matchLocation(s);
      const child = roster.find((n) => new RegExp(`\\b${n}\\b`, "i").test(s)) ?? null;

      // Title: the subject for emails; otherwise the text with date/time/location
      // spans removed and connector words trimmed.
      let title: string;
      if (input.kind === "email") {
        title = input.subject.trim();
      } else {
        let t = s;
        for (const raw of [loc?.raw, ti?.raw, d?.raw]) if (raw) t = t.replace(raw, " ");
        title = t
          .replace(/\b(on|at|@|from|due)\b/gi, " ")
          .replace(/[—–-]+/g, " ")
          .replace(/[.,;:]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      const found = [title, d, ti, loc, child].filter(Boolean).length;
      const confidence = Math.min(1, 0.4 + found * 0.14);
      return { title, date: d?.value ?? null, time: ti?.value ?? null, location: loc?.value ?? null, child, confidence };
    },
  };
}

/** Per-field accuracy of an extractor over a labelled set (AC-P1). */
export async function fieldAccuracy(
  extractor: EventExtractor,
  cases: { input: CaptureInput; expected: Omit<ExtractedEvent, "confidence"> }[],
): Promise<number> {
  let correct = 0;
  let total = 0;
  for (const c of cases) {
    const got = await extractor.extractEvent(c.input);
    for (const f of ["title", "date", "time", "location", "child"] as const) {
      total++;
      if ((got[f] ?? null) === (c.expected[f] ?? null)) correct++;
    }
  }
  return total === 0 ? 1 : correct / total;
}
