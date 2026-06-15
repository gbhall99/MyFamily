/**
 * Autonomy-ladder control (DESIGN_SPEC §6.1 / AC-DA7). Shows each level with its
 * plain-language consequence; the current selection and its meaning are
 * unmistakable, and changing it is immediate and reversible.
 */
import { View, Text, Pressable } from "react-native";
import { themes, space, radius, type as typeRoles, minTouchTarget, type ThemeName } from "@myfamily/tokens";
import { AUTONOMY_LEVELS, consequenceCopy, type AutonomyLevel } from "./autonomy.js";

const LABELS: Record<AutonomyLevel, string> = {
  notify: "Notify",
  suggest: "Suggest",
  auto_undo: "Auto, with undo",
  full_auto: "Full auto",
};

export function AutonomyLadder({ value, theme = "light", onChange }: { value: AutonomyLevel; theme?: ThemeName; onChange?: (l: AutonomyLevel) => void }) {
  const t = themes[theme];
  return (
    <View role="radiogroup" accessibilityLabel="Autonomy level">
      {AUTONOMY_LEVELS.map((level) => {
        const selected = level === value;
        return (
          <Pressable
            key={level}
            role="radio"
            aria-checked={selected}
            accessibilityLabel={`${LABELS[level]}. ${consequenceCopy(level)}`}
            onPress={() => onChange?.(level)}
            style={{
              minHeight: minTouchTarget.ios,
              padding: space[3],
              borderRadius: radius.md,
              borderWidth: selected ? 2 : 1,
              borderColor: selected ? t.brand : t.border,
              backgroundColor: t.surface,
              marginBottom: space[2],
            }}
          >
            {/* selection carried by label + border weight, not colour alone (AC-D9) */}
            <Text style={{ color: t.text, fontSize: typeRoles.label.size, fontWeight: selected ? "700" : "500" }}>
              {selected ? `✓ ${LABELS[level]}` : LABELS[level]}
            </Text>
            <Text style={{ color: t.textSecondary, fontSize: typeRoles.caption.size }}>{consequenceCopy(level)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
