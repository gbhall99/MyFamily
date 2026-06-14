/**
 * MyFamily — Expo app entry. Thin composition layer: it wires @myfamily/core
 * (domain logic / view-models) into @myfamily/ui (tokens-only rendered screens).
 * All real logic + UI live in the tested packages; this just mounts them.
 */
import { useMemo } from "react";
import { SafeAreaView, ScrollView, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { assembleBrief, detectConflicts, type FamilyEvent } from "@myfamily/core";
import { TodayView, type Member } from "@myfamily/ui";
import { themes } from "@myfamily/tokens";

const MEMBERS: Member[] = [
  { name: "Maya", accentIndex: 0 },
  { name: "Devin", accentIndex: 1 },
  { name: "Leo", accentIndex: 2 },
  { name: "Mia", accentIndex: 3 },
];

const TODAY = Date.now();
const hours = (h: number) => TODAY + h * 3600_000;

const EVENTS: FamilyEvent[] = [
  { id: "1", title: "Soccer", start: hours(8), end: hours(9), member: "Leo", needsDriver: true, location: "Field A" },
  { id: "2", title: "Swim", start: hours(8.5), end: hours(9.5), member: "Mia", needsDriver: true, location: "Pool B" },
];

export default function App() {
  const theme = (useColorScheme() ?? "light") as "light" | "dark";

  const briefVM = useMemo(() => {
    const conflicts = detectConflicts(EVENTS, TODAY - 3600_000);
    const b = assembleBrief({
      logistics: ["School run 8:15", "Swim 5:00 PM"],
      conflicts,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: themes[theme].bg }}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <ScrollView>
        <TodayView brief={briefVM} members={MEMBERS} theme={theme} />
      </ScrollView>
    </SafeAreaView>
  );
}
