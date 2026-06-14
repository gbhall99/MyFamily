/**
 * The real product screens (DESIGN_SPEC §6). Each composes the tokens-only
 * @myfamily/ui components and @myfamily/core view-models, with proper empty /
 * loading states and a calm, designed layout.
 */
import { useMemo, useState } from "react";
import {
  MemberChip,
  ApproveChip,
  CaptureBar,
  AutonomyLadder,
  type Member,
  type Suggestion,
  type ActivityEntry,
  type AutonomyLevel,
  type CaptureKind,
} from "@myfamily/ui";
import { assembleBrief, detectConflicts, planGoal, type FamilyEvent, type Plan } from "@myfamily/core";
import { space, radius, type as typeRoles } from "@myfamily/tokens";
import { AppHeader, Card, Kicker, Screen, useTheme } from "./chrome.js";

export const MEMBERS: Member[] = [
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

// ---------------------------------------------------------------- Today

export function TodayScreen({
  log,
  handled,
  setHandled,
  onDecision,
  onCapture,
}: {
  log: ActivityEntry[];
  handled: string[];
  setHandled: React.Dispatch<React.SetStateAction<string[]>>;
  onDecision: () => void;
  onCapture: (k: CaptureKind) => void;
}) {
  const { t, theme } = useTheme();
  const brief = useMemo(
    () =>
      assembleBrief({
        logistics: ["School run — 8:15", "Swim — 5:00 PM"],
        conflicts: detectConflicts(EVENTS, NOW - 3600_000),
        decisions: [
          { id: "drive", prompt: "Ask another parent to drive Mia to swim?", priority: 3 },
          { id: "dentist", prompt: "Move the dentist reminder to Saturday?", priority: 2 },
        ],
        handled: [],
      }),
    [],
  );

  const suggestions: Suggestion[] = brief.decisions.map((d) => ({
    id: d.id,
    summary: d.prompt,
    reason: d.id === "drive" ? "Soccer & swim clash on Thursday" : "frees up your Thursday evening",
    category: "logistics",
    apply: () => setHandled((h) => [d.prompt, ...h]),
    revert: () => setHandled((h) => h.filter((x) => x !== d.prompt)),
  }));

  const longDate = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <Screen>
        <div style={{ paddingTop: space[6] }}>
          <Kicker>{longDate}</Kicker>
          <h1 style={{ margin: "6px 0 0", fontSize: typeRoles.display.size, fontWeight: 800, lineHeight: 1.05 }}>Good morning</h1>
          <p style={{ margin: "6px 0 0", color: t.textSecondary, fontSize: typeRoles.bodyM.size }}>
            {suggestions.length} need a tap · {handled.length} already handled
          </p>
        </div>

        <section style={{ marginTop: space[5] }}>
          <Kicker>Your family</Kicker>
          <div style={{ display: "flex", gap: space[3], marginTop: space[2] }}>
            {MEMBERS.map((m) => (
              <div key={m.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <MemberChip name={m.name} accentIndex={m.accentIndex} theme={theme} />
                <span style={{ fontSize: 12, color: t.textSecondary }}>{m.name}</span>
              </div>
            ))}
          </div>
        </section>

        {brief.conflicts.length > 0 && (
          <div style={{ marginTop: space[5] }}>
            <Card accent={t.statusWarn}>
              <Kicker color={t.statusWarn}>⚠ Heads-up</Kicker>
              <p style={{ margin: "6px 0 0", fontSize: typeRoles.bodyL.size, lineHeight: 1.4 }}>{brief.conflicts[0]!.explanation}</p>
            </Card>
          </div>
        )}

        <section style={{ marginTop: space[5] }}>
          <Kicker>Needs a tap</Kicker>
          <div style={{ display: "flex", flexDirection: "column", gap: space[3], marginTop: space[2] }}>
            {suggestions.map((s) => (
              <Card key={s.id} style={{ padding: space[3] }}>
                <ApproveChip suggestion={s} log={log} theme={theme} onDecision={onDecision} />
              </Card>
            ))}
          </div>
        </section>

        <div style={{ marginTop: space[5] }}>
          <Card>
            <strong style={{ fontSize: typeRoles.label.size }}>Today</strong>
            {brief.logistics.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: space[2], marginTop: i === 0 ? space[2] : 6, color: t.textSecondary }}>
                <span aria-hidden style={{ color: t.brand }}>•</span>
                <span style={{ fontSize: typeRoles.bodyM.size }}>{l}</span>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ marginTop: space[5] }}>
          <Card>
            <strong style={{ fontSize: typeRoles.label.size }}>I already handled</strong>
            {handled.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: space[2], marginTop: i === 0 ? space[2] : 6, color: t.textSecondary }}>
                <span aria-hidden style={{ color: t.statusSuccess }}>✓</span>
                <span style={{ fontSize: typeRoles.bodyM.size }}>{h}</span>
              </div>
            ))}
          </Card>
        </div>
      </Screen>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 64,
          display: "flex",
          justifyContent: "center",
          padding: space[2],
          pointerEvents: "none",
        }}
      >
        <div style={{ width: "100%", maxWidth: 460, pointerEvents: "auto" }}>
          <CaptureBar theme={theme} onCapture={onCapture} />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------- Co-pilot

export function PlanScreen({ onApprovePlan }: { onApprovePlan: (plan: Plan) => void }) {
  const { t } = useTheme();
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const examples = ["Sort out Leo's birthday party", "Plan a weekend away", "Organise Mia's dentist + kit"];

  return (
    <Screen>
      <AppHeader title="Co-pilot" subtitle="Tell me a goal in plain words. I'll turn it into a plan you can approve." />

      <div style={{ marginTop: space[5], display: "flex", gap: space[2] }}>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. sort out Leo's party"
          aria-label="What do you need sorted?"
          style={{
            flex: 1,
            padding: "14px 16px",
            borderRadius: radius.md,
            border: `1px solid ${t.border}`,
            background: t.surface,
            color: t.text,
            fontSize: typeRoles.bodyL.size,
          }}
        />
        <button
          onClick={() => goal.trim() && setPlan(planGoal(goal))}
          style={{ background: t.brand, color: t.textOnBrand, border: "none", borderRadius: radius.md, padding: "0 18px", fontWeight: 700, cursor: "pointer" }}
        >
          Plan
        </button>
      </div>

      {!plan ? (
        <div style={{ marginTop: space[6], textAlign: "center", color: t.textSecondary }}>
          <div aria-hidden style={{ fontSize: 40 }}>✦</div>
          <p style={{ fontSize: typeRoles.bodyM.size }}>Try one of these:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setGoal(ex);
                  setPlan(planGoal(ex));
                }}
                style={{ border: `1px solid ${t.border}`, background: t.surface, color: t.text, borderRadius: radius.pill, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: space[5] }}>
          <Kicker>Plan for {plan.subject}</Kicker>
          <div style={{ display: "flex", flexDirection: "column", gap: space[3], marginTop: space[2] }}>
            {plan.sections.map((s) => (
              <Card key={s.key}>
                <strong style={{ fontSize: typeRoles.label.size }}>{s.title}</strong>
                {s.items.map((it, i) => (
                  <div key={i} style={{ display: "flex", gap: space[2], marginTop: i === 0 ? space[2] : 6, color: t.textSecondary }}>
                    <span aria-hidden style={{ color: t.border }}>☐</span>
                    <span style={{ fontSize: typeRoles.bodyM.size }}>{it}</span>
                  </div>
                ))}
              </Card>
            ))}
          </div>
          <button
            onClick={() => onApprovePlan(plan)}
            style={{ marginTop: space[4], width: "100%", background: t.brand, color: t.textOnBrand, border: "none", borderRadius: radius.pill, padding: "14px", fontWeight: 700, fontSize: typeRoles.bodyL.size, cursor: "pointer" }}
          >
            Approve this plan
          </button>
        </div>
      )}
    </Screen>
  );
}

// ---------------------------------------------------------------- Activity

export function ActivityScreen({ log }: { log: ActivityEntry[] }) {
  const { t } = useTheme();
  const entries = [...log].reverse();
  return (
    <Screen>
      <AppHeader title="Activity" subtitle="Everything I did for you — with the reason, and an undo." />
      {entries.length === 0 ? (
        <div style={{ marginTop: space[7], textAlign: "center", color: t.textSecondary }}>
          <div aria-hidden style={{ fontSize: 40 }}>↻</div>
          <p style={{ fontSize: typeRoles.bodyM.size, maxWidth: 280, margin: "8px auto 0" }}>
            Nothing yet. When I handle something — approve a suggestion or run a plan — it shows here with a clear reason and an undo.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: space[3], marginTop: space[5] }}>
          {entries.map((e, i) => (
            <Card key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: space[3] }}>
                <strong style={{ fontSize: typeRoles.bodyM.size }}>{e.summary}</strong>
                <span style={{ fontSize: 11, color: e.undoneAt ? t.textMuted : t.statusSuccess, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {e.undoneAt ? "Undone" : "✓ Done"}
                </span>
              </div>
              <p style={{ margin: "4px 0 0", color: t.textSecondary, fontSize: typeRoles.caption.size }}>
                {e.reason} · {new Date(e.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}

// ---------------------------------------------------------------- Settings

const CATEGORIES: { key: string; label: string; help: string }[] = [
  { key: "calendar", label: "Calendar & conflicts", help: "Detecting clashes and reshuffling logistics." },
  { key: "messages", label: "Messages & drafts", help: "Replying to threads and group chats." },
  { key: "shopping", label: "Meals & shopping", help: "Building carts and placing grocery orders." },
];

export function SettingsScreen({
  levels,
  setLevel,
}: {
  levels: Record<string, AutonomyLevel>;
  setLevel: (key: string, level: AutonomyLevel) => void;
}) {
  const { t, theme } = useTheme();
  return (
    <Screen>
      <AppHeader title="Settings" subtitle="How much should I do on my own? Change any category — it's instant and reversible." />
      <div style={{ display: "flex", flexDirection: "column", gap: space[4], marginTop: space[5] }}>
        {CATEGORIES.map((c) => (
          <div key={c.key}>
            <strong style={{ fontSize: typeRoles.label.size }}>{c.label}</strong>
            <p style={{ margin: "2px 0 8px", color: t.textSecondary, fontSize: typeRoles.caption.size }}>{c.help}</p>
            <AutonomyLadder value={levels[c.key] ?? "suggest"} theme={theme} onChange={(l) => setLevel(c.key, l)} />
          </div>
        ))}
        <Card>
          <Kicker>Privacy</Kicker>
          <p style={{ margin: "6px 0 0", color: t.textSecondary, fontSize: typeRoles.bodyM.size }}>
            Kids' data is minimised, never used for training, and access is scoped by role. The shared family display hides
            personal and financial detail by default.
          </p>
        </Card>
      </div>
    </Screen>
  );
}
