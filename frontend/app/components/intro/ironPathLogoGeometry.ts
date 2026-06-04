/**
 * Decomposed geometry of the official Iron Path logo mark (149×134 PNG).
 * Coordinates match the raster icon above the IRON PATH wordmark.
 * Used only to animate assembly — final frame uses /brand/iron-path-logo.png.
 */
export const LOGO_MARK_VIEWBOX = { width: 149, height: 76 };

/** Sloped foundation (ramp rising left → right). */
export const LOGO_BASE_PATH = "M22 66 L127 66 L127 56 L22 61 Z";

export const LOGO_COLUMNS = [
  { id: "column-left", x: 36, y: 24, width: 15, height: 37 },
  { id: "column-center", x: 60, y: 24, width: 15, height: 33 },
  { id: "column-right", x: 84, y: 24, width: 15, height: 29 },
] as const;

export const LOGO_MIDDLE_BAR = { x: 30, y: 17, width: 89, height: 5 };
export const LOGO_TOP_BAR = { x: 44, y: 9, width: 61, height: 3 };

export type LogoPartId =
  | "base"
  | "column-left"
  | "column-center"
  | "column-right"
  | "middle-bar"
  | "top-bar";

/** Assembly order: foundation → pillars → capitals. */
export const LOGO_ASSEMBLY_ORDER: LogoPartId[] = [
  "base",
  "column-left",
  "column-center",
  "column-right",
  "middle-bar",
  "top-bar",
];

/** Initial offsets (px) before snapping into place — no rotation. */
export const LOGO_PART_ORIGIN: Record<
  LogoPartId,
  { x: number; y: number; opacity?: number }
> = {
  base: { x: 0, y: 22 },
  "column-left": { x: -10, y: -18 },
  "column-center": { x: 0, y: -22 },
  "column-right": { x: 10, y: -18 },
  "middle-bar": { x: -14, y: 0 },
  "top-bar": { x: 14, y: 0 },
};

export const LOGO_INTRO_TIMING_MS = {
  partStagger: 220,
  partDuration: 480,
  assembleSettle: 200,
  glint: 900,
  taglineStagger: 380,
  taglineHold: 700,
  shrink: 520,
  handoff: 180,
} as const;
