/** Unified motion tokens — CSS variables + ms helpers. */
export const MOTION_DURATION = {
  fast: 120,
  normal: 220,
  screen: 240,
  stage: 260,
  stagger: 200,
  progress: 700,
  completion: 280,
  slow: 320,
} as const;

export const MOTION_EASE = {
  out: "cubic-bezier(0.33, 1, 0.68, 1)",
  inOut: "cubic-bezier(0.45, 0, 0.55, 1)",
} as const;

export const MOTION_STAGGER_STEP_MS = 40;
export const MOTION_STAGGER_MAX_DELAY_MS = 200;

export const CSS_VARS = {
  fast: "--motion-duration-fast",
  normal: "--motion-duration-normal",
  screen: "--motion-duration-screen",
  stage: "--motion-duration-stage",
  stagger: "--motion-duration-stagger",
  progress: "--motion-duration-progress",
  completion: "--motion-duration-completion",
  digit: "--motion-duration-digit",
  slow: "--motion-duration-slow",
  easeOut: "--motion-ease-out",
} as const;
