"use client";

import {
  LOGO_BASE_PATH,
  LOGO_COLUMNS,
  LOGO_MIDDLE_BAR,
  LOGO_TOP_BAR,
  LOGO_VIEWBOX,
} from "./ironPathLogoGeometry";

type Props = {
  revealed: boolean;
  className?: string;
};

/** Full Iron Path logo as inline SVG (static mark + wordmark). */
export default function IronPathLogoSvg({ revealed, className = "" }: Props) {
  const { width, height } = LOGO_VIEWBOX;

  return (
    <svg
      className={`logo-intro-svg block mx-auto ${revealed ? "logo-intro-unified--visible" : "logo-intro-unified"} ${className}`.trim()}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      role="presentation"
    >
      <g className="logo-intro-mark-group">
        <path d={LOGO_BASE_PATH} fill="currentColor" />
        {LOGO_COLUMNS.map((col) => (
          <rect
            key={col.id}
            x={col.x}
            y={col.y}
            width={col.width}
            height={col.height}
            fill="currentColor"
          />
        ))}
        <rect
          x={LOGO_MIDDLE_BAR.x}
          y={LOGO_MIDDLE_BAR.y}
          width={LOGO_MIDDLE_BAR.width}
          height={LOGO_MIDDLE_BAR.height}
          fill="currentColor"
        />
        <rect
          x={LOGO_TOP_BAR.x}
          y={LOGO_TOP_BAR.y}
          width={LOGO_TOP_BAR.width}
          height={LOGO_TOP_BAR.height}
          fill="currentColor"
        />
      </g>
      <text
        x={width / 2}
        y={104}
        textAnchor="middle"
        className="fill-current"
        style={{
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.32em",
        }}
      >
        IRON PATH
      </text>
    </svg>
  );
}
