/**
 * Minimal ambient types for the subset of `react-native` our components use.
 * Keeps typecheck honest without installing the full react-native package; at
 * runtime (tests) the import is aliased to `react-native-web`, and in the Expo
 * app it resolves to the real react-native.
 */
declare module "react-native" {
  import type { ReactNode, ComponentType } from "react";

  export type Style = Record<string, unknown>;
  export type StyleProp = Style | Style[] | undefined | false | null;

  export interface AccessibilityState {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
  }

  export interface AccessibilityProps {
    accessible?: boolean;
    accessibilityRole?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityState?: AccessibilityState;
    accessibilityLiveRegion?: "none" | "polite" | "assertive";
    testID?: string;
    nativeID?: string;
    // Modern ARIA props (supported by RN 0.71+ and react-native-web).
    role?: string;
    "aria-label"?: string;
    "aria-checked"?: boolean;
    "aria-selected"?: boolean;
    "aria-live"?: "off" | "polite" | "assertive";
  }

  export interface ViewProps extends AccessibilityProps {
    style?: StyleProp;
    children?: ReactNode;
  }
  export const View: ComponentType<ViewProps>;

  export interface TextProps extends AccessibilityProps {
    style?: StyleProp;
    children?: ReactNode;
    numberOfLines?: number;
    maxFontSizeMultiplier?: number;
  }
  export const Text: ComponentType<TextProps>;

  export interface PressableProps extends AccessibilityProps {
    style?: StyleProp;
    children?: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
  }
  export const Pressable: ComponentType<PressableProps>;

  export const StyleSheet: {
    create<T extends Record<string, Style>>(styles: T): T;
    flatten(style: StyleProp): Style;
  };

  export const AccessibilityInfo: {
    isReduceMotionEnabled(): Promise<boolean>;
  };
}
