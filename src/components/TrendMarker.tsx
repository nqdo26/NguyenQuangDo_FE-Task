import React from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

export type TrendMarkerType = "up" | "down";

export type TrendIconMarkerProps = {
  cx?: number;
  cy?: number;
  type: TrendMarkerType;
};

export const TrendIconMarker = ({ cx, cy, type }: TrendIconMarkerProps) => {
  if (cx == null || cy == null) {
    return null;
  }

  const Icon = type === "up" ? TrendingUp : TrendingDown;
  const strokeColor = type === "up" ? "#16a34a" : "#dc2626";
  const backgroundFill = type === "up" ? "#bbf7d0" : "#fecaca";

  return (
    <g transform={`translate(${cx - 12}, ${cy - 12})`}>
      <circle cx={12} cy={12} r={14} fill={backgroundFill} opacity={0.7} />
      <Icon
        width={24}
        height={24}
        stroke={strokeColor}
        strokeWidth={1.75}
        fill="none"
      />
    </g>
  );
};
