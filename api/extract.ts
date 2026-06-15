/**
 * Serverless event extraction (Vercel Node function). Uses Groq server-side when
 * GROQ_API_KEY is set (the key never reaches the browser); otherwise returns a
 * 503 so the client falls back to its on-device heuristic. Self-contained so it
 * bundles reliably on Vercel.
 */
interface Req {
  method?: string;
  body?: { text?: string; roster?: string[] } | string;
}
interface Res {
  status: (code: number) => Res;
  json: (body: unknown) => void;
}

const SYSTEM =
  "You extract a SINGLE calendar event from short family text. Return ONLY JSON with keys: " +
  'title (string), date (ISO "YYYY-MM-DD", lowercase weekday, or null), time ("HH:MM" 24h or null), ' +
  "location (string or null), child (one roster name that appears or null), confidence (0..1). " +
  "Use year 2026 when omitted. Invent nothing.";

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};
  const text = String(body.text ?? "");
  const roster: string[] = Array.isArray(body.roster) ? body.roster : [];
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    res.status(503).json({ error: "no model configured" }); // client uses on-device fallback
    return;
  }

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Roster: ${roster.join(", ")}\nText: ${text}` },
        ],
      }),
    });
    if (!r.ok) throw new Error(`Groq ${r.status}`);
    const json = (await r.json()) as { choices: { message: { content: string } }[] };
    const raw = json.choices[0]?.message.content ?? "{}";
    const obj = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
    res.status(200).json({ event: obj, source: "model" });
  } catch (e) {
    res.status(502).json({ error: String((e as Error).message) });
  }
}
