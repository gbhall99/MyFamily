/**
 * Capture bar (DESIGN_SPEC §6.1 / AC-DA9, SPEC §6.1 / AC-G3). The universal
 * one-gesture entry point: snap a photo, speak, paste, or forward — each a single
 * tap that starts capture immediately. There is deliberately NO form. Sits in the
 * thumb zone with full-size touch targets.
 */
import { View, Text, Pressable } from "react-native";
import { themes, space, radius, minTouchTarget, type as typeRoles, type ThemeName } from "@myfamily/tokens";

export type CaptureKind = "photo" | "voice" | "paste" | "forward";

const ACTIONS: { kind: CaptureKind; label: string; glyph: string }[] = [
  { kind: "photo", label: "Snap a photo", glyph: "⌖" },
  { kind: "voice", label: "Speak", glyph: "◉" },
  { kind: "paste", label: "Paste", glyph: "❏" },
  { kind: "forward", label: "Forward", glyph: "➦" },
];

export function CaptureBar({ theme = "light", onCapture }: { theme?: ThemeName; onCapture?: (kind: CaptureKind) => void }) {
  const t = themes[theme];
  return (
    <View
      accessibilityRole="toolbar"
      accessibilityLabel="Add something"
      style={{ flexDirection: "row", gap: space[2], backgroundColor: t.surface, padding: space[2], borderRadius: radius.lg }}
    >
      {ACTIONS.map((a) => (
        <Pressable
          key={a.kind}
          accessibilityRole="button"
          accessibilityLabel={a.label}
          onPress={() => onCapture?.(a.kind)}
          style={{
            minWidth: minTouchTarget.ios,
            minHeight: minTouchTarget.ios,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.md,
            backgroundColor: t.bg,
          }}
        >
          <Text style={{ color: t.brand, fontSize: typeRoles.titleM.size }}>{a.glyph}</Text>
          <Text style={{ color: t.textSecondary, fontSize: typeRoles.caption.size }}>{a.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
