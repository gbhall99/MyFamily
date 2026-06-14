/**
 * MyFamily web companion (DESIGN_SPEC §11). Renders the tokens-only @myfamily/ui
 * components — including the hero one-tap Approve chips and the capture bar —
 * wiring @myfamily/core view-models in. Static site, deployed on Vercel.
 */
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { assembleBrief, detectConflicts, type FamilyEvent } from "@myfamily/core";
import {
  MemberChip,
  ApproveChip,
  CaptureBar,
  type Member,
  type Suggestion,
  type ActivityEntry,
  type CaptureKind,
} from "@myfamily/ui";
import { themes, space, radius, type as typeRoles, type ThemeName } from "@myfamily/tokens";

const MEMBERS: Member[] = [
  { name: "Maya", accentIndex: 0 },
  { name: "Devin", accentIndex: 1 },
  { name: "Leo", accentIndex: 2 },
  { name: "Mia", accentIndex: 3 },
];

const NOW = Date.now();
const hrs = (h: number) => NOW + h * 3600_000;
const EVENTS: FamilyEvent[] = [
  { id: "1", title: "Soccer", start: hrs(8), end: hrs(9), member: "Leo", needsDriver: true, location: "Field A" },
  { id: "2", title: "Swim", start: hrs(8.5), end: hrs(9.5), member: "Mia", needsDriver: true, location: "Pool B" },
];

const longDate = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

export function Companion() {
  const [theme, setTheme] = useState<ThemeName>("light");
  const [handled, setHandled] = useState<string[]>(["Booked the haircut", "Filed the school newsletter"]);
  const [toast, setToast] = useState<string | null>(null);
  const t = themes[theme];
  const log: ActivityEntry[] = useMemo(() => [], []);

  const brief = useMemo(() => {
    const conflicts = detectConflicts(EVENTS, NOW - 3600_000);
    return assembleBrief({
      logistics: ["School run — 8:15", "Swim — 5:00 PM"],
      conflicts,
      decisions: [
        { id: "drive", prompt: "Ask another parent to drive Mia to swim?", priority: 3 },
        { id: "dentist", prompt: "Move the dentist reminder to Saturday?", priority: 2 },
      ],
      handled: [],
    });
  }, []);

  const suggestions: Suggestion[] = brief.decisions.map((d) => ({
    id: d.id,
    summary: d.prompt,
    reason: d.id === "drive" ? "Soccer & swim clash on Thursday" : "frees up your Thursday evening",
    category: "logistics",
    apply: () => setHandled((h) => [d.prompt, ...h]),
    revert: () => setHandled((h) => h.filter((x) => x !== d.prompt)),
  }));

  const onCapture = (k: CaptureKind) => {
    const label = { photo: "Camera", voice: "Voice", paste: "Paste", forward: "Forward" }[k];
    setToast(`${label} capture — point it at a flyer and I'll file the event.`);
    setTimeout(() => setToast(null), 2600);
  };

  const card = {
    background: t.surface,
    borderRadius: radius.lg,
    padding: space[4],
    boxShadow: theme === "light" ? "0 1px 2px rgba(20,20,20,.05), 0 12px 28px rgba(20,20,20,.06)" : "0 1px 2px rgba(0,0,0,.4)",
  } as const;
  const sectionLabel = { fontSize: typeRoles.label.size, fontWeight: 700, letterSpacing: 0.3, color: t.text } as const;
  const kicker = { fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: t.textMuted, fontWeight: 700 } as const;

  return (
    <div style={{ minHeight: "100dvh", background: t.bg, color: t.text, transition: "background 200ms" }}>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: `0 ${space[4]}px ${space[8] + 56}px` }}>
        {/* Header */}
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingTop: space[6] }}>
          <div>
            <div style={kicker}>{longDate}</div>
            <h1 style={{ margin: "6px 0 0", fontSize: typeRoles.display.size, lineHeight: 1.05, fontWeight: 800 }}>Good morning</h1>
            <p style={{ margin: "6px 0 0", color: t.textSecondary, fontSize: typeRoles.bodyM.size }}>
              {suggestions.length} need a tap · {handled.length} already handled
            </p>
          </div>
          <button
            onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}
            aria-label="Toggle light or dark theme"
            style={{
              cursor: "pointer",
              border: `1px solid ${t.border}`,
              background: t.surface,
              color: t.text,
              borderRadius: radius.pill,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {theme === "light" ? "☾ Dark" : "☀ Light"}
          </button>
        </header>

        {/* Family */}
        <section style={{ marginTop: space[5] }}>
          <div style={{ ...kicker, marginBottom: space[2] }}>Your family</div>
          <div style={{ display: "flex", gap: space[3] }}>
            {MEMBERS.map((m) => (
              <div key={m.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <MemberChip name={m.name} accentIndex={m.accentIndex} theme={theme} />
                <span style={{ fontSize: 12, color: t.textSecondary }}>{m.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Heads-up / conflict */}
        {brief.conflicts.length > 0 && (
          <section style={{ ...card, marginTop: space[5], borderLeft: `3px solid ${t.statusWarn}` }}>
            <div style={{ ...kicker, color: t.statusWarn }}>⚠ Heads-up</div>
            <p style={{ margin: "6px 0 0", fontSize: typeRoles.bodyL.size, lineHeight: 1.4 }}>{brief.conflicts[0]!.explanation}</p>
          </section>
        )}

        {/* Needs a tap — the hero one-tap Approve chips */}
        <section style={{ marginTop: space[5] }}>
          <div style={{ ...kicker, marginBottom: space[2] }}>Needs a tap</div>
          <div style={{ display: "flex", flexDirection: "column", gap: space[3] }}>
            {suggestions.map((s) => (
              <div key={s.id} style={card}>
                <ApproveChip suggestion={s} log={log} theme={theme} />
              </div>
            ))}
          </div>
        </section>

        {/* Today */}
        <section style={{ ...card, marginTop: space[5] }}>
          <div style={sectionLabel}>Today</div>
          {brief.logistics.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: space[2], marginTop: i === 0 ? space[2] : 6, color: t.textSecondary }}>
              <span aria-hidden style={{ color: t.brand }}>•</span>
              <span style={{ fontSize: typeRoles.bodyM.size }}>{l}</span>
            </div>
          ))}
        </section>

        {/* Already handled */}
        <section style={{ ...card, marginTop: space[5] }}>
          <div style={sectionLabel}>I already handled</div>
          {handled.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: space[2], marginTop: i === 0 ? space[2] : 6, color: t.textSecondary }}>
              <span aria-hidden style={{ color: t.statusSuccess }}>✓</span>
              <span style={{ fontSize: typeRoles.bodyM.size }}>{h}</span>
            </div>
          ))}
        </section>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 92,
            maxWidth: 420,
            width: "calc(100% - 32px)",
            background: t.text,
            color: t.bg,
            padding: "12px 16px",
            borderRadius: radius.md,
            fontSize: 14,
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,.18)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Capture bar — signature one-gesture entry point, pinned bottom */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          padding: `${space[2]}px`,
          background: theme === "light" ? "rgba(251,250,248,.85)" : "rgba(21,23,26,.85)",
          backdropFilter: "blur(10px)",
          borderTop: `1px solid ${t.border}`,
        }}
      >
        <div style={{ width: "100%", maxWidth: 460 }}>
          <CaptureBar theme={theme} onCapture={onCapture} />
        </div>
      </div>
    </div>
  );
}

const rootEl = typeof document !== "undefined" ? document.getElementById("root") : null;
if (rootEl) createRoot(rootEl).render(<Companion />);
