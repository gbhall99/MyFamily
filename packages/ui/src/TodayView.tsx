/**
 * Today / Daily-Brief screen (DESIGN_SPEC §6.1) — the retention-loop home.
 * Composes the member row + Daily Brief. View-models (the assembled Brief) are
 * passed in by the app layer so this stays free of any @myfamily/core cycle.
 */
import { View, Text } from "react-native";
import { themes, space, type as typeRoles, type ThemeName } from "@myfamily/tokens";
import { MemberChip } from "./MemberChip.js";
import { DailyBriefCard, type BriefVM } from "./DailyBriefCard.js";

export interface Member {
  name: string;
  accentIndex: number;
}

export function TodayView({
  brief,
  members,
  greeting = "Good morning",
  theme = "light",
  onDecide,
}: {
  brief: BriefVM;
  members: Member[];
  greeting?: string;
  theme?: ThemeName;
  onDecide?: (id: string) => void;
}) {
  const t = themes[theme];
  return (
    <View role="none" style={{ backgroundColor: t.bg, padding: space[4], gap: space[4] }}>
      <Text role="heading" style={{ color: t.text, fontSize: typeRoles.titleL.size, fontWeight: "700" }}>
        {greeting}
      </Text>
      <View role="list" accessibilityLabel="Family" style={{ flexDirection: "row", gap: space[2] }}>
        {members.map((m) => (
          <MemberChip key={m.name} name={m.name} accentIndex={m.accentIndex} theme={theme} />
        ))}
      </View>
      <DailyBriefCard brief={brief} theme={theme} {...(onDecide ? { onDecide } : {})} />
    </View>
  );
}
