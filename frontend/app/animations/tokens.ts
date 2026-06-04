/** Unified motion tokens — CSS variables + ms helpers. */
export const MOTION_DURATION = {
  fast: 150,
  normal: 220,
  slow: 320,
} as const;

export const MOTION_EASE = {
  out: "cubic-bezier(0.33, 1, 0.68, 1)",
  inOut: "cubic-bezier(0.45, 0, 0.55, 1)",
} as const;

export const MOTION_STAGGER_STEP_MS = 45;

export const CSS_VARS = {
  fast: "--motion-duration-fast",
  normal: "--motion-duration-normal",
  slow: "--motion-duration-slow",
  easeOut: "--motion-ease-out",
} as const;
