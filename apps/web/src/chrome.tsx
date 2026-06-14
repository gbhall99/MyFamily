/**
 * Shared web chrome for the MyFamily companion. Token-driven presentational
 * primitives + theme context + bottom tab navigation. Keeps every screen visually
 * consistent and calm (DESIGN_SPEC §2, §5, §9).
 */
import { createContext, useContext, type ReactNode } from "react";
import { themes, space, radius, type as typeRoles, type ThemeName, type SemanticColors } from "@myfamily/tokens";

interface ThemeValue {
  theme: ThemeName;
  t: SemanticColors;
  toggle: () => void;
}
const ThemeCtx = createContext<ThemeValue | null>(null);
export const useTheme = (): ThemeValue => {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme outside provider");
  return v;
};
export function ThemeProvider({ theme, toggle, children }: { theme: ThemeName; toggle: () => void; children: ReactNode }) {
  return <ThemeCtx.Provider value={{ theme, t: themes[theme], toggle }}>{children}</ThemeCtx.Provider>;
}

export function shadow(theme: ThemeName): string {
  return theme === "light" ? "0 1px 2px rgba(20,20,20,.05), 0 12px 28px rgba(20,20,20,.06)" : "0 1px 2px rgba(0,0,0,.5)";
}

export function Card({ children, accent, style }: { children: ReactNode; accent?: string; style?: React.CSSProperties }) {
  const { t, theme } = useTheme();
  return (
    <div
      style={{
        background: t.surface,
        borderRadius: radius.lg,
        padding: space[4],
        boxShadow: shadow(theme),
        ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Kicker({ children, color }: { children: ReactNode; color?: string }) {
  const { t } = useTheme();
  return (
    <div style={{ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 700, color: color ?? t.textMuted }}>
      {children}
    </div>
  );
}

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t, theme, toggle } = useTheme();
  return (
    <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", paddingTop: space[6] }}>
      <div>
        <h1 style={{ margin: 0, fontSize: typeRoles.titleL.size, fontWeight: 800, lineHeight: 1.1 }}>{title}</h1>
        {subtitle && <p style={{ margin: "6px 0 0", color: t.textSecondary, fontSize: typeRoles.bodyM.size }}>{subtitle}</p>}
      </div>
      <button
        onClick={toggle}
        aria-label="Toggle light or dark theme"
        style={{ cursor: "pointer", border: `1px solid ${t.border}`, background: t.surface, color: t.text, borderRadius: radius.pill, padding: "8px 14px", fontSize: 13, fontWeight: 600 }}
      >
        {theme === "light" ? "☾" : "☀"}
      </button>
    </header>
  );
}

export type TabId = "today" | "plan" | "activity" | "settings";
const TABS: { id: TabId; label: string; glyph: string }[] = [
  { id: "today", label: "Today", glyph: "◉" },
  { id: "plan", label: "Co-pilot", glyph: "✦" },
  { id: "activity", label: "Activity", glyph: "↻" },
  { id: "settings", label: "Settings", glyph: "⚙" },
];

export function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  const { t, theme } = useTheme();
  return (
    <nav
      aria-label="Primary"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        background: theme === "light" ? "rgba(251,250,248,.9)" : "rgba(21,23,26,.9)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${t.border}`,
      }}
    >
      <div style={{ display: "flex", width: "100%", maxWidth: 460 }}>
        {TABS.map((tab) => {
          const on = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-current={on ? "page" : undefined}
              aria-label={tab.label}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "10px 0 14px",
                color: on ? t.brand : t.textMuted,
                fontWeight: on ? 700 : 500,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span aria-hidden style={{ fontSize: 20 }}>{tab.glyph}</span>
              <span style={{ fontSize: 11 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  const { t } = useTheme();
  return (
    <div style={{ minHeight: "100dvh", background: t.bg, color: t.text }}>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: `0 ${space[4]}px ${space[8] + 64}px` }}>{children}</div>
    </div>
  );
}
