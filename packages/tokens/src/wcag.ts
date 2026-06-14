/**
 * Colour-science helpers used to VERIFY tokens against the accessibility floor
 * (DESIGN_SPEC §10). These power the automated audits that decide AC-D1, AC-DA1,
 * and AC-DA2 — they are test infrastructure, not consumed by UI.
 */
import type { Hex } from "./color.js";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: Hex): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

const srgbToLinear = (c: number): number => {
  const cs = c / 255;
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
};

/** WCAG relative luminance. */
export function luminance(hex: Hex): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG 2.x contrast ratio (1–21). */
export function contrastRatio(a: Hex, b: Hex): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

// --- CIELAB + CIE76 ΔE (perceptual distance) ---------------------------------

function rgbToXyz({ r, g, b }: RGB): [number, number, number] {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return [
    R * 0.4124 + G * 0.3576 + B * 0.1805,
    R * 0.2126 + G * 0.7152 + B * 0.0722,
    R * 0.0193 + G * 0.1192 + B * 0.9505,
  ];
}

function xyzToLab([x, y, z]: [number, number, number]): [number, number, number] {
  // D65 reference white
  const xr = x / 0.95047;
  const yr = y / 1.0;
  const zr = z / 1.08883;
  const f = (t: number): number => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(xr);
  const fy = f(yr);
  const fz = f(zr);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function labOf(hex: Hex): [number, number, number] {
  return xyzToLab(rgbToXyz(hexToRgb(hex)));
}

/** CIE76 ΔE between two colours (>~2.3 is a just-noticeable difference). */
export function deltaE(a: Hex, b: Hex): number {
  const [l1, a1, b1] = labOf(a);
  const [l2, a2, b2] = labOf(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

// --- Colour-blind simulation (Machado et al. 2009, severity 1.0) -------------

type Mat = readonly [number, number, number, number, number, number, number, number, number];
const CB_MATRICES: Record<"protan" | "deutan" | "tritan", Mat> = {
  protan: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deutan: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04203, 0.96979],
  tritan: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
};

const clamp255 = (n: number): number => Math.max(0, Math.min(255, Math.round(n)));
const toHex2 = (n: number): string => clamp255(n).toString(16).padStart(2, "0");

/** Simulate how a colour appears to a viewer with the given colour-blindness. */
export function simulate(hex: Hex, kind: keyof typeof CB_MATRICES): Hex {
  const { r, g, b } = hexToRgb(hex);
  const m = CB_MATRICES[kind];
  const nr = m[0] * r + m[1] * g + m[2] * b;
  const ng = m[3] * r + m[4] * g + m[5] * b;
  const nb = m[6] * r + m[7] * g + m[8] * b;
  return `#${toHex2(nr)}${toHex2(ng)}${toHex2(nb)}` as Hex;
}

export const colorBlindKinds = ["protan", "deutan", "tritan"] as const;
