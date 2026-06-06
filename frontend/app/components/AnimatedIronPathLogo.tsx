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
      viewBox="0 0 280 184"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="iron-path-logo-title"
      className={`iron-logo-svg ${motionClass} ${className}`.trim()}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="iron-path-logo-title">Iron Path</title>

      {/* 1 — top cap (narrow, centered; sits closer to main beam) */}
      <g className="iron-logo-piece iron-logo-topBar" aria-hidden="true">
        <rect x="109" y="0" width="62" height="10" />
      </g>

      {/* 2 — middle beam / roof (primary horizontal) */}
      <g className="iron-logo-piece iron-logo-middleBar" aria-hidden="true">
        <rect x="28" y="13" width="224" height="11" />
      </g>

      {/* 3 — columns (subtle height taper follows gentle base slope) */}
      <g className="iron-logo-piece iron-logo-columns" aria-hidden="true">
        <rect x="65" y="26" width="25" height="80" />
        <rect x="127" y="26" width="25" height="79" />
        <rect x="189" y="26" width="25" height="78" />
      </g>

      {/* 4 — base (subtle upward slope ~65% shallower than prior) */}
      <g className="iron-logo-piece iron-logo-bottomBar" aria-hidden="true">
        <polygon points="28,110 252,110 252,104 28,107" />
      </g>

      {/* 5 — wordmark */}
      <g className="iron-logo-piece iron-logo-text">
        <text x="140" y="148" textAnchor="middle">
          IRON PATH
        </text>
      </g>
    </svg>
  );
}
