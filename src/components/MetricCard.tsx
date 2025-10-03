import React from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

export type MetricFormat = "currency" | "number";

export type MetricCardProps = {
  title: string;
  currentValue: number;
  previousValue: number;
  compareToPrevious: boolean;
  format: MetricFormat;
  suffix?: string;
  extra?: React.ReactNode;
};

const formatValue = (value: number, format: MetricFormat, suffix = "") => {
  return format === "currency"
    ? `$${value.toLocaleString()}`
    : `${value.toLocaleString()}${suffix}`;
};

export const MetricCard = ({
  title,
  currentValue,
  previousValue,
  compareToPrevious,
  format,
  suffix = "",
  extra,
}: MetricCardProps) => {
  const formattedCurrent = formatValue(currentValue, format, suffix);
  const formattedPrevious = formatValue(previousValue, format, suffix);
  const percentageChange = (
    previousValue === 0
      ? 0
      : ((currentValue - previousValue) / previousValue) * 100
  ).toFixed(1);

  return (
    <div className="relative bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900">{formattedCurrent}</p>
        {compareToPrevious && (
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">
              vs {formattedPrevious}
            </span>
            <span className="text-sm text-green-600 font-medium">
              (+{percentageChange}%)
            </span>
          </div>
        )}
      </div>
      {extra}
    </div>
  );
};

export const CoversCardExtra = () => (
  <div className="absolute top-2 right-2 flex gap-1">
    <TrendingUp className="w-4 h-4 text-green-500" />
    <TrendingDown className="w-4 h-4 text-red-500" />
  </div>
);
