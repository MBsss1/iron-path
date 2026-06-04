/**
 * Inline SVG geometry for the Iron Path logo (mark + wordmark).
 * No raster assets — avoids broken images in Telegram WebView.
 */
export const LOGO_VIEWBOX = { width: 200, height: 118 };
export const LOGO_MARK_HEIGHT = 78;

/** Sloped base: flat bottom, top edge rises left → right. */
export const LOGO_BASE_PATH = "M28 68 L172 68 L172 58 L28 64 Z";

/** Tops aligned; bottoms sit on the sloped base (left shortest → right tallest). */
export const LOGO_COLUMNS = [
  { id: "column-left", x: 54, y: 30, width: 16, height: 34 },
  { id: "column-center", x: 84, y: 30, width: 16, height: 30 },
  { id: "column-right", x: 114, y: 30, width: 16, height: 26 },
] as const;

export const LOGO_MIDDLE_BAR = { x: 38, y: 20, width: 124, height: 6 };
export const LOGO_TOP_BAR = { x: 48, y: 10, width: 104, height: 4 };

export type LogoPartId =
  | "base"
  | "column-left"
  | "column-center"
  | "column-right"
  | "middle-bar"
  | "top-bar";

/** Foundation → pillars → capitals. */
export const LOGO_ASSEMBLY_ORDER: LogoPartId[] = [
  "base",
  "column-left",
  "column-center",
  "column-right",
  "middle-bar",
  "top-bar",
];

/** Entry direction per part (translate only, no rotation). */
export const LOGO_PART_ORIGIN: Record<LogoPartId, { x: number; y: number }> = {
  base: { x: -16, y: 22 },
  "column-left": { x: 0, y: 26 },
  "column-center": { x: 0, y: 26 },
  "column-right": { x: 0, y: 26 },
  "middle-bar": { x: 0, y: -16 },
  "top-bar": { x: 0, y: -20 },
};

export const LOGO_INTRO_TIMING_MS = {
  partStagger: 200,
  partDuration: 460,
  assembleSettle: 180,
  glint: 880,
  taglineStagger: 360,
  taglineBeforeCta: 400,
} as const;
