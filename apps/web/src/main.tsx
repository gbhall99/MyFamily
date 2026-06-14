/**
 * MyFamily web companion (DESIGN_SPEC §11). Mounts the same tokens-only screens
 * as the native app via react-native-web, wiring @myfamily/core view-models into
 * @myfamily/ui. Deployed as a static site (e.g. Vercel).
 */
import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { assembleBrief, detectConflicts, type FamilyEvent } from "@myfamily/core";
import { TodayView, type Member } from "@myfamily/ui";
import { themes, type ThemeName } from "@myfamily/tokens";

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

function Companion() {
  const [theme, setTheme] = useState<ThemeName>("light");
  const briefVM = useMemo(() => {
    const b = assembleBrief({
      logistics: ["School run 8:15", "Swim 5:00 PM"],
      conflicts: detectConflicts(EVENTS, NOW - 3600_000),
      decisions: [
        { id: "drive", prompt: "Ask another parent to drive Mia to swim?", priority: 3 },
        { id: "dentist", prompt: "Move the dentist reminder to Saturday?", priority: 2 },
      ],
      handled: ["Booked haircut", "Filed the school newsletter"],
    });
    return {
      logistics: b.logistics,
      conflicts: b.conflicts.map((c) => c.explanation),
      decisions: b.decisions.map((d) => ({ id: d.id, prompt: d.prompt })),
      handled: b.handled,
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: themes[theme].bg, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <button
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label="Toggle theme"
          style={{ margin: 12, padding: "6px 12px", borderRadius: 999, cursor: "pointer" }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <TodayView brief={briefVM} members={MEMBERS} theme={theme} />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<Companion />);
