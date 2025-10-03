import React from "react";

export type RevenueSeriesKey = "posRevenue" | "eatclubRevenue" | "labourCosts";

export type RevenueSeriesToggleGroupProps = {
  visibleSeries: Record<RevenueSeriesKey, boolean>;
  onToggle: (series: RevenueSeriesKey) => void;
};

const seriesConfigs: Array<{
  key: RevenueSeriesKey;
  label: string;
  colorClass: string;
}> = [
  { key: "posRevenue", label: "POS Revenue", colorClass: "bg-black" },
  {
    key: "eatclubRevenue",
    label: "Eatclub Revenue",
    colorClass: "bg-blue-500",
  },
  {
    key: "labourCosts",
    label: "Labour Costs",
    colorClass: "bg-orange-500",
  },
];

export const RevenueSeriesToggleGroup = ({
  visibleSeries,
  onToggle,
}: RevenueSeriesToggleGroupProps) => {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm lg:justify-center">
      {seriesConfigs.map(({ key, label, colorClass }) => (
        <label key={key} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={visibleSeries[key]}
            onChange={() => onToggle(key)}
            className="w-4 h-4 border border-black bg-white accent-black"
          />
          <span className={`w-4 h-0.5 ${colorClass}`}></span>
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {label}
          </span>
        </label>
      ))}
    </div>
  );
};
