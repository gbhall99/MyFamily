/**
 * Member identity chip (DESIGN_SPEC §3.3 / AC-DA2 / AC-D9). The accent colour is
 * ALWAYS paired with the member's initial (a non-colour cue) and an accessible
 * name, so identity never depends on colour alone.
 */
import { View, Text } from "react-native";
import { memberAccents, themes, space, radius, type ThemeName } from "@myfamily/tokens";

export interface MemberChipProps {
  name: string;
  accentIndex: number;
  theme?: ThemeName;
}

export function MemberChip({ name, accentIndex, theme = "light" }: MemberChipProps) {
  const accents = theme === "light" ? memberAccents.light : memberAccents.dark;
  const accent = accents[accentIndex % accents.length]!;
  const initial = name.trim().charAt(0).toUpperCase();
  const onAccent = theme === "light" ? themes.light.textOnBrand : themes.dark.bg;

  return (
    <View
      role="img"
      accessibilityLabel={name}
      style={{
        backgroundColor: accent,
        width: space[6],
        height: space[6],
        borderRadius: radius.pill,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* non-colour cue: the initial, not just the colour */}
      <Text style={{ color: onAccent, fontWeight: "600" }}>{initial}</Text>
    </View>
  );
}
