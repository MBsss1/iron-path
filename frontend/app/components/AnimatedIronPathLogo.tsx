"use client";

type Props = {
  className?: string;
  /** When true, all pieces render in final state with no motion. */
  reducedMotion?: boolean;
};

/**
 * Iron Path wordmark — inline SVG matched to official logo geometry.
 * Scale via width on the root element (120px–320px+); viewBox is fixed.
 */
export default function AnimatedIronPathLogo({
  className = "",
  reducedMotion = false,
}: Props) {
  const motionClass = reducedMotion ? "iron-logo-svg--static" : "iron-logo-svg--animate";

  return (
    <svg
      viewBox="0 0 280 196"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="iron-path-logo-title"
      className={`iron-logo-svg ${motionClass} ${className}`.trim()}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="iron-path-logo-title">Iron Path</title>

      {/* 1 — top cap (narrow, centered) */}
      <g className="iron-logo-piece iron-logo-topBar" aria-hidden="true">
        <rect x="109" y="0" width="62" height="10" />
      </g>

      {/* 2 — middle beam (widest horizontal) */}
      <g className="iron-logo-piece iron-logo-middleBar" aria-hidden="true">
        <rect x="36" y="16" width="208" height="12" />
      </g>

      {/* 3 — columns (bottoms follow slanted base: left tallest → right shortest) */}
      <g className="iron-logo-piece iron-logo-columns" aria-hidden="true">
        <rect x="54" y="32" width="22" height="74" />
        <rect x="129" y="32" width="22" height="70" />
        <rect x="204" y="32" width="22" height="66" />
      </g>

      {/* 4 — slanted base (top edge rises left → right) */}
      <g className="iron-logo-piece iron-logo-bottomBar" aria-hidden="true">
        <polygon points="36,116 244,116 244,96 36,108" />
      </g>

      {/* 5 — wordmark */}
      <g className="iron-logo-piece iron-logo-text">
        <text x="140" y="156" textAnchor="middle">
          IRON PATH
        </text>
      </g>
    </svg>
  );
}
