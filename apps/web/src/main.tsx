/**
 * MyFamily web companion — app shell. Holds theme, tab navigation, and the shared
 * activity log, and renders the real product screens (Today, Co-pilot, Activity,
 * Settings). Static site, deployed on Vercel.
 */
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { logEntry, type ActivityEntry, type AutonomyLevel, type CaptureKind } from "@myfamily/ui";
import { type Plan } from "@myfamily/core";
import { radius, type ThemeName } from "@myfamily/tokens";
import { ThemeProvider, TabBar, useTheme, type TabId } from "./chrome.js";
import { TodayScreen, PlanScreen, ActivityScreen, SettingsScreen } from "./screens.js";

function Toast({ message }: { message: string }) {
  const { t } = useTheme();
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 140,
        maxWidth: 420,
        width: "calc(100% - 32px)",
        background: t.text,
        color: t.bg,
        padding: "12px 16px",
        borderRadius: radius.md,
        fontSize: 14,
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,.18)",
        zIndex: 10,
      }}
    >
      {message}
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState<ThemeName>("light");
  const [tab, setTab] = useState<TabId>("today");
  const [handled, setHandled] = useState<string[]>(["Booked the haircut", "Filed the school newsletter"]);
  const [levels, setLevels] = useState<Record<string, AutonomyLevel>>({ calendar: "auto_undo", messages: "suggest", shopping: "notify" });
  const [toast, setToast] = useState<string | null>(null);

  const logRef = useRef<ActivityEntry[]>([]);
  const [log, setLog] = useState<ActivityEntry[]>([]);
  const refreshLog = () => setLog([...logRef.current]);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };

  const onCapture = (k: CaptureKind) => {
    const label = { photo: "Camera", voice: "Voice", paste: "Paste", forward: "Forward" }[k];
    showToast(`${label} capture — point it at a flyer and I'll file the event.`);
  };

  const onApprovePlan = (plan: Plan) => {
    logEntry(logRef.current, { summary: `Started plan for ${plan.subject}`, reason: `you approved the ${plan.sections.length}-step plan`, category: "copilot" });
    refreshLog();
    showToast(`On it — I've started the plan for ${plan.subject}.`);
    setTab("activity");
  };

  return (
    <ThemeProvider theme={theme} toggle={() => setTheme((p) => (p === "light" ? "dark" : "light"))}>
      {tab === "today" && (
        <TodayScreen log={logRef.current} handled={handled} setHandled={setHandled} onDecision={refreshLog} onCapture={onCapture} />
      )}
      {tab === "plan" && <PlanScreen onApprovePlan={onApprovePlan} />}
      {tab === "activity" && <ActivityScreen log={log} />}
      {tab === "settings" && <SettingsScreen levels={levels} setLevel={(k, l) => setLevels((p) => ({ ...p, [k]: l }))} />}

      {toast && <Toast message={toast} />}
      <TabBar active={tab} onChange={setTab} />
    </ThemeProvider>
  );
}

const rootEl = typeof document !== "undefined" ? document.getElementById("root") : null;
if (rootEl) createRoot(rootEl).render(<App />);
