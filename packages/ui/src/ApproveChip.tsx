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

  const container = { backgroundColor: t.surface, borderRadius: radius.md, padding: space[4] };
  const primary = { backgroundColor: t.brand, minHeight: minTouchTarget.ios, borderRadius: radius.pill, paddingHorizontal: space[4], justifyContent: "center" as const };
  const secondary = { backgroundColor: t.surface, borderColor: t.borderStrong, borderWidth: 1, minHeight: minTouchTarget.ios, borderRadius: radius.pill, paddingHorizontal: space[4], justifyContent: "center" as const };
  const onBrand = { color: t.textOnBrand, fontSize: typeRoles.label.size, fontWeight: String(typeRoles.label.weight) };
  const onSurface = { color: t.brand, fontSize: typeRoles.label.size };

  return (
    <View accessibilityRole="group" style={container}>
      <Text style={{ color: t.text, fontSize: typeRoles.bodyL.size }}>{suggestion.summary}</Text>
      <Text style={{ color: t.textMuted, fontSize: typeRoles.caption.size }}>{suggestion.reason}</Text>

      {!done ? (
        <View accessibilityRole="toolbar">
          <Pressable accessibilityRole="button" accessibilityLabel={`Approve: ${suggestion.summary}`} onPress={accept} style={primary}>
            <Text style={onBrand}>Approve</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Edit" onPress={() => choose("edit")} style={secondary}>
            <Text style={onSurface}>Edit</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Decline" onPress={() => choose("decline")} style={secondary}>
            <Text style={onSurface}>Decline</Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <Text accessibilityLiveRegion="polite" style={{ color: t.statusSuccess, fontSize: typeRoles.bodyM.size }}>
            Handled.
          </Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Undo" onPress={() => undo?.()} style={secondary}>
            <Text style={onSurface}>Undo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
