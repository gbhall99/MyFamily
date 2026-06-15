/**
 * The hero one-tap Approve chip (DESIGN_SPEC §6.1, §7.3). Rendered RN component
 * consuming tokens only. Accept is one gesture, shows what will happen, exposes
 * inline edit + decline (non-destructive), and after accepting reveals a calm,
 * live-announced confirmation with an immediately visible undo (AC-DA4, AC-DA5).
 */
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { themes, space, radius, minTouchTarget, type as typeRoles, type ThemeName } from "@myfamily/tokens";
import { decide, type Suggestion, type Decision } from "./approve.js";
import type { ActivityEntry } from "./activityLog.js";

export interface ApproveChipProps {
  suggestion: Suggestion;
  log: ActivityEntry[];
  theme?: ThemeName;
  onDecision?: (d: Decision) => void;
}

export function ApproveChip({ suggestion, log, theme = "light", onDecision }: ApproveChipProps) {
  const t = themes[theme];
  const [undo, setUndo] = useState<(() => void) | null>(null);
  const [done, setDone] = useState(false);

  const accept = () => {
    const r = decide(suggestion, "accept", log);
    setUndo(() => r.undo ?? null);
    setDone(true);
    onDecision?.("accept");
  };
  const choose = (d: Decision) => onDecision?.(d);

  const container = { backgroundColor: t.surface, borderRadius: radius.lg, padding: space[4], gap: space[3] };
  const btnBase = { minHeight: minTouchTarget.ios, borderRadius: radius.pill, paddingHorizontal: space[4], alignItems: "center" as const, justifyContent: "center" as const };
  const primary = { ...btnBase, backgroundColor: t.brand, flex: 1 };
  const secondary = { ...btnBase, backgroundColor: t.surface, borderColor: t.borderStrong, borderWidth: 1 };
  const onBrand = { color: t.textOnBrand, fontSize: typeRoles.label.size, fontWeight: typeRoles.label.weight };
  const onSurface = { color: t.brand, fontSize: typeRoles.label.size, fontWeight: typeRoles.label.weight };

  return (
    <View role="group" style={container}>
      <View style={{ gap: 3 }}>
        <Text style={{ color: t.text, fontSize: typeRoles.bodyL.size, fontWeight: "600" }}>{suggestion.summary}</Text>
        <Text style={{ color: t.textMuted, fontSize: typeRoles.caption.size }}>{suggestion.reason}</Text>
      </View>

      {!done ? (
        <View role="toolbar" style={{ flexDirection: "row", gap: space[2] }}>
          <Pressable role="button" accessibilityLabel={`Approve: ${suggestion.summary}`} onPress={accept} style={primary}>
            <Text style={onBrand}>Approve</Text>
          </Pressable>
          <Pressable role="button" accessibilityLabel="Edit" onPress={() => choose("edit")} style={secondary}>
            <Text style={onSurface}>Edit</Text>
          </Pressable>
          <Pressable role="button" accessibilityLabel="Decline" onPress={() => choose("decline")} style={secondary}>
            <Text style={onSurface}>Decline</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text aria-live="polite" style={{ color: t.statusSuccess, fontSize: typeRoles.bodyM.size, fontWeight: "600" }}>
            ✓ Handled
          </Text>
          <Pressable role="button" accessibilityLabel="Undo" onPress={() => undo?.()} style={secondary}>
            <Text style={onSurface}>Undo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
