/**
 * Capture sheet — the one-gesture capture made real. Paste/type a flyer or note,
 * and it extracts a structured event (model when configured, on-device otherwise)
 * for one-tap filing. Low-confidence extractions are flagged for review, never
 * filed blindly (AC-G9).
 */
import { useState } from "react";
import { type as typeRoles, radius, space } from "@myfamily/tokens";
import type { ExtractedEvent } from "@myfamily/core";
import { useTheme } from "./chrome.js";
import { extractEvent, type ExtractResult } from "./lib/extract.js";

const EXAMPLE = "Leo's swim gala — Thursday 5pm at the Aquatic Centre. Bring a towel.";

export function summarise(e: ExtractedEvent): string {
  const bits = [e.title || "Untitled", e.date, e.time, e.location ? `@ ${e.location}` : null].filter(Boolean);
  return bits.join(" · ");
}

export function CaptureSheet({ open, onClose, onFiled }: { open: boolean; onClose: () => void; onFiled: (line: string, source: string) => void }) {
  const { t } = useTheme();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ExtractResult | null>(null);

  if (!open) return null;

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setResult(null);
    setResult(await extractEvent(text));
    setBusy(false);
  };

  const reset = () => {
    setText("");
    setResult(null);
  };
  const close = () => {
    reset();
    onClose();
  };

  const ev = result?.event;
  const confident = !!ev && ev.confidence >= 0.7 && !!ev.title && !!ev.date;

  return (
    <div className="overlay" onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 460, background: t.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space[4], paddingBottom: space[6] }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: t.border, margin: "0 auto 16px" }} />
        <h2 style={{ margin: 0, fontSize: typeRoles.titleM.size, fontWeight: 700 }}>Add anything</h2>
        <p style={{ margin: "4px 0 12px", color: t.textSecondary, fontSize: typeRoles.bodyM.size }}>
          Paste a flyer, message, or note — I'll pull out the event.
        </p>

        {!result && (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={EXAMPLE}
              aria-label="Paste or type what you captured"
              rows={4}
              style={{ width: "100%", resize: "none", padding: 14, borderRadius: radius.md, border: `1px solid ${t.border}`, background: t.bg, color: t.text, fontSize: typeRoles.bodyL.size, fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", gap: space[2], marginTop: space[3] }}>
              <button onClick={() => setText(EXAMPLE)} style={{ border: `1px solid ${t.border}`, background: t.surface, color: t.textSecondary, borderRadius: radius.pill, padding: "10px 14px", cursor: "pointer", fontSize: 13 }}>
                Try an example
              </button>
              <button onClick={run} disabled={busy || !text.trim()} style={{ flex: 1, border: "none", background: t.brand, color: t.textOnBrand, borderRadius: radius.pill, padding: "12px", fontWeight: 700, cursor: "pointer", opacity: busy || !text.trim() ? 0.6 : 1 }}>
                {busy ? "Reading…" : "Capture"}
              </button>
            </div>
          </>
        )}

        {ev && (
          <div style={{ marginTop: space[2] }}>
            <div style={{ background: t.bg, borderRadius: radius.md, padding: space[4], borderLeft: `3px solid ${confident ? t.statusSuccess : t.statusWarn}` }}>
              <div style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, color: t.textMuted }}>
                {confident ? "I found this" : "Not sure — please check"} · {result!.source === "model" ? "✨ model" : "on-device"}
              </div>
              <div style={{ marginTop: 8, fontSize: typeRoles.bodyL.size, fontWeight: 600 }}>{ev.title || "Untitled"}</div>
              <div style={{ marginTop: 4, color: t.textSecondary, fontSize: typeRoles.bodyM.size }}>
                {[ev.date, ev.time, ev.location, ev.child].filter(Boolean).join(" · ") || "no date/time found"}
              </div>
            </div>
            <div style={{ display: "flex", gap: space[2], marginTop: space[3] }}>
              <button onClick={reset} style={{ border: `1px solid ${t.border}`, background: t.surface, color: t.text, borderRadius: radius.pill, padding: "12px 16px", cursor: "pointer" }}>
                Try again
              </button>
              <button
                onClick={() => {
                  onFiled(summarise(ev), result!.source);
                  close();
                }}
                style={{ flex: 1, border: "none", background: confident ? t.brand : t.statusWarn, color: t.textOnBrand, borderRadius: radius.pill, padding: "12px", fontWeight: 700, cursor: "pointer" }}
              >
                {confident ? "File it" : "File anyway"}
              </button>
            </div>
          </div>
        )}

        <button onClick={close} aria-label="Close" style={{ width: "100%", marginTop: space[3], background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", padding: 8 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
