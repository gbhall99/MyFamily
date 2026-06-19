/**
 * Daily Brief card (DESIGN_SPEC §6.1 / AC-DA6, SPEC §7.3 / AC-P16). Renders the
 * four canonical sections — today's logistics, caught conflicts, ≤3 one-tap
 * decisions, and what was already handled — with accessible headings. Takes a
 * plain view-model (assembled by @myfamily/core) to avoid a package cycle.
 */
import { View, Text, Pressable } from "react-native";
import { themes, space, radius, type as typeRoles, minTouchTarget, type ThemeName } from "@myfamily/tokens";

export interface BriefDecisionVM {
  id: string;
  prompt: string;
}
export interface BriefVM {
  logistics: string[];
  conflicts: string[];
  decisions: BriefDecisionVM[]; // already capped to ≤3 by core.assembleBrief
  handled: string[];
}

function Section({ title, items, theme }: { title: string; items: string[]; theme: ThemeName }) {
  const t = themes[theme];
  return (
    <View role="summary" style={{ marginBottom: space[3] }}>
      <Text role="heading" style={{ color: t.text, fontSize: typeRoles.label.size, fontWeight: "600" }}>
        {title}
      </Text>
      {items.map((it, i) => (
        <Text key={i} style={{ color: t.textSecondary, fontSize: typeRoles.bodyM.size }}>
          {it}
        </Text>
      ))}
    </View>
  );
}

export function DailyBriefCard({ brief, theme = "light", onDecide }: { brief: BriefVM; theme?: ThemeName; onDecide?: (id: string) => void }) {
  const t = themes[theme];
  return (
    <View role="group" accessibilityLabel="Daily Brief" style={{ backgroundColor: t.surface, borderRadius: radius.lg, padding: space[4] }}>
      <Section title="Today" items={brief.logistics} theme={theme} />
      <Section title="Heads-up" items={brief.conflicts} theme={theme} />
      <View role="summary" style={{ marginBottom: space[3] }}>
        <Text role="heading" style={{ color: t.text, fontSize: typeRoles.label.size, fontWeight: "600" }}>
          Needs a tap
        </Text>
        {brief.decisions.map((d) => (
          <Pressable
            key={d.id}
            role="button"
            accessibilityLabel={d.prompt}
            onPress={() => onDecide?.(d.id)}
            style={{ minHeight: minTouchTarget.ios, justifyContent: "center" }}
          >
            <Text style={{ color: t.brand, fontSize: typeRoles.bodyM.size }}>{d.prompt}</Text>
          </Pressable>
        ))}
      </View>
      <Section title="Already handled" items={brief.handled} theme={theme} />
    </View>
  );
}
