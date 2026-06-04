"use client";

import type { CSSProperties } from "react";
import {
  LOGO_BASE_PATH,
  LOGO_COLUMNS,
  LOGO_MIDDLE_BAR,
  LOGO_PART_ORIGIN,
  LOGO_TOP_BAR,
  LOGO_VIEWBOX,
  type LogoPartId,
} from "./ironPathLogoGeometry";

type Props = {
  activeParts: Set<LogoPartId>;
  showWordmark: boolean;
  assembled: boolean;
  className?: string;
};

function partClass(id: LogoPartId, active: boolean): string {
  return `logo-intro-part logo-intro-part--${id}${
    active ? " logo-intro-part--placed" : ""
  }`;
}

function partStyle(id: LogoPartId): CSSProperties {
  const origin = LOGO_PART_ORIGIN[id];
  return {
    ["--logo-part-x" as string]: `${origin.x}px`,
    ["--logo-part-y" as string]: `${origin.y}px`,
  };
}

/** Full Iron Path logo as inline SVG (mark parts + IRON PATH wordmark). */
export default function IronPathLogoSvg({
  activeParts,
  showWordmark,
  assembled,
  className = "",
}: Props) {
  const { width, height } = LOGO_VIEWBOX;

  return (
    <svg
      className={`logo-intro-svg block mx-auto ${className}`.trim()}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      role="presentation"
    >
      <g
        className={`logo-intro-mark-group ${assembled ? "logo-intro-mark-group--assembled" : ""}`}
      >
        <path
          className={partClass("base", activeParts.has("base"))}
          style={partStyle("base")}
          d={LOGO_BASE_PATH}
          fill="currentColor"
        />
        {LOGO_COLUMNS.map((col) => (
          <rect
            key={col.id}
            className={partClass(
              col.id as LogoPartId,
              activeParts.has(col.id as LogoPartId)
            )}
            style={partStyle(col.id as LogoPartId)}
            x={col.x}
            y={col.y}
            width={col.width}
            height={col.height}
            fill="currentColor"
          />
        ))}
        <rect
          className={partClass("middle-bar", activeParts.has("middle-bar"))}
          style={partStyle("middle-bar")}
          x={LOGO_MIDDLE_BAR.x}
          y={LOGO_MIDDLE_BAR.y}
          width={LOGO_MIDDLE_BAR.width}
          height={LOGO_MIDDLE_BAR.height}
          fill="currentColor"
        />
        <rect
          className={partClass("top-bar", activeParts.has("top-bar"))}
          style={partStyle("top-bar")}
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
        className={`logo-intro-wordmark fill-current ${
          showWordmark ? "logo-intro-wordmark--visible" : ""
        }`}
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
