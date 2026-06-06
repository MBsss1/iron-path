"use client";

type Props = {
  className?: string;
  /** When true, all pieces render in final state with no motion. */
  reducedMotion?: boolean;
};

/**
 * Inline temple-style Iron Path mark — cap, beam, columns, base, wordmark.
 * viewBox is fixed; scale via width on the root SVG (120–320px).
 */
export default function AnimatedIronPathLogo({
  className = "",
  reducedMotion = false,
}: Props) {
  const motionClass = reducedMotion ? "iron-logo-svg--static" : "iron-logo-svg--animate";

  return (
    <svg
      viewBox="0 0 280 210"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="iron-path-logo-title"
      className={`iron-logo-svg ${motionClass} ${className}`.trim()}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="iron-path-logo-title">Iron Path</title>

      <g className="iron-logo-icon" aria-hidden="true">
        {/* 1 — top cap / roof */}
        <rect
          className="iron-logo-piece iron-logo-cap"
          x="108"
          y="4"
          width="64"
          height="11"
        />

        {/* 2 — middle beam / architrave */}
        <rect
          className="iron-logo-piece iron-logo-beam"
          x="38"
          y="22"
          width="204"
          height="13"
        />

        {/* 3 — columns (three stones) */}
        <rect
          className="iron-logo-piece iron-logo-col iron-logo-col-1"
          x="56"
          y="40"
          width="22"
          height="68"
        />
        <rect
          className="iron-logo-piece iron-logo-col iron-logo-col-2"
          x="129"
          y="40"
          width="22"
          height="68"
        />
        <rect
          className="iron-logo-piece iron-logo-col iron-logo-col-3"
          x="202"
          y="40"
          width="22"
          height="68"
        />

        {/* 4 — slanted base / stylobate */}
        <polygon
          className="iron-logo-piece iron-logo-base"
          points="38,118 242,118 242,106 38,98"
        />
      </g>

      {/* Wordmark */}
      <text
        className="iron-logo-piece iron-logo-wordmark"
        x="140"
        y="162"
        textAnchor="middle"
      >
        IRON PATH
      </text>
    </svg>
  );
}
