"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

import {
  mockRevenueWeekData,
  mockRevenueSummary,
  defaultRevenueSeriesVisibility,
} from "@/mocks/revenue";
import { RevenueSeriesToggleGroup } from "@/components/RevenueSeriesToggleGroup";
import { MetricCard, CoversCardExtra } from "@/components/MetricCard";
import { TrendIconMarker } from "@/components/TrendMarker";
import {
  type RevenueSeriesKey,
  type RevenueSeriesVisibility,
  type WeekdayRevenue,
} from "@/interfaces/revenue";

type ChartDataItem = WeekdayRevenue & {
  previousPosRevenue: number;
  previousEatclubRevenue: number;
  previousLabourCosts: number;
};

const RevenueTrendChart = () => {
  const [compareToPrevious, setCompareToPrevious] = useState(false);
  const { currentWeek, previousWeek } = mockRevenueWeekData;
  const { current: currentSummary, previous: previousSummary } =
    mockRevenueSummary;

  const [visibleSeries, setVisibleSeries] = useState<RevenueSeriesVisibility>({
    ...defaultRevenueSeriesVisibility,
  });

  const chartData: ChartDataItem[] = currentWeek.map((current, index) => ({
    ...current,
    previousPosRevenue: compareToPrevious
      ? previousWeek[index]?.posRevenue ?? 0
      : 0,
    previousEatclubRevenue: compareToPrevious
      ? previousWeek[index]?.eatclubRevenue ?? 0
      : 0,
    previousLabourCosts: compareToPrevious
      ? previousWeek[index]?.labourCosts ?? 0
      : 0,
  }));

  const { totalRevenue, averagePerDay, totalCovers } = currentSummary;
  const {
    totalRevenue: previousTotalRevenue,
    averagePerDay: previousAveragePerDay,
    totalCovers: previousTotalCovers,
  } = previousSummary;

  const handleExportPNG = () => {
    console.log("Exporting chart as PNG...");
  };

  const toggleSeries = (series: RevenueSeriesKey) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  const getPeakValue = (index: number) => {
    const currentDay = currentWeek[index];
    const previousDay = previousWeek[index];

    const currentPeak = Math.max(
      currentDay.posRevenue + currentDay.eatclubRevenue,
      currentDay.labourCosts
    );

    if (!compareToPrevious) {
      return currentPeak;
    }

    if (!previousDay) {
      return currentPeak;
    }

    const previousPeak = Math.max(
      previousDay.posRevenue + previousDay.eatclubRevenue,
      previousDay.labourCosts
    );

    return Math.max(currentPeak, previousPeak);
  };

  const trendMarkers = [
    { day: "Mon", index: 0, type: "up" as const },
    { day: "Thu", index: 3, type: "down" as const },
  ].map(({ day, index, type }) => ({
    day,
    type,
    y: getPeakValue(index) + 250,
  }));

  const summaryMetrics = [
    {
      key: "totalRevenue",
      title: "Total Revenue",
      currentValue: totalRevenue,
      previousValue: previousTotalRevenue,
      format: "currency" as const,
    },
    {
      key: "averagePerDay",
      title: "Average per Day",
      currentValue: averagePerDay,
      previousValue: previousAveragePerDay,
      format: "currency" as const,
    },
    {
      key: "totalCovers",
      title: "Total Covers",
      currentValue: totalCovers,
      previousValue: previousTotalCovers,
      format: "number" as const,
      extra: <CoversCardExtra />,
    },
  ];

  type TooltipEntry = {
    color?: string;
    name?: string;
    value?: number | string | Array<number | string>;
    dataKey?: React.Key;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipContentProps<number, string>) => {
    if (active && payload && payload.length) {
      const tooltipPayload = payload as TooltipEntry[];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {tooltipPayload.map((entry) => {
            const value =
              typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value;

            return (
              <p
                key={entry.dataKey?.toString() ?? entry.name}
                style={{ color: entry.color }}
                className="text-sm"
              >
                {entry.name}: ${value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            This Week&apos;s Revenue Trend
            {compareToPrevious ? " vs Previous Period" : ""}
          </CardTitle>

          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-end lg:gap-6">
            <RevenueSeriesToggleGroup
              visibleSeries={visibleSeries}
              onToggle={toggleSeries}
            />

            <div className="flex flex-wrap gap-3 sm:justify-start lg:justify-end">
              <Button
                onClick={() => setCompareToPrevious(!compareToPrevious)}
                variant={compareToPrevious ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Compare to Previous
              </Button>
              <Button
                onClick={handleExportPNG}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export PNG
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {summaryMetrics.map(({ key, ...metric }) => (
            <MetricCard
              key={key}
              compareToPrevious={compareToPrevious}
              {...metric}
            />
          ))}
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              barCategoryGap={compareToPrevious ? "30%" : "60%"}
              barGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip<number, string>
                content={(props: TooltipContentProps<number, string>) => (
                  <CustomTooltip {...props} />
                )}
              />

              <Bar
                dataKey="posRevenue"
                stackId="current"
                fill="#000000"
                name="POS Revenue (Current)"
                hide={!visibleSeries.posRevenue}
                barSize={compareToPrevious ? 30 : 60}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="eatclubRevenue"
                stackId="current"
                fill="#3b82f6"
                name="Eatclub Revenue (Current)"
                hide={!visibleSeries.eatclubRevenue}
                barSize={compareToPrevious ? 30 : 60}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="labourCosts"
                stackId="labourCurrent"
                fill="#f97316"
                name="Labour Costs (Current)"
                hide={!visibleSeries.labourCosts}
                barSize={compareToPrevious ? 30 : 60}
                radius={[6, 6, 0, 0]}
              />

              {compareToPrevious && (
                <>
                  <Bar
                    dataKey="previousPosRevenue"
                    stackId="previous"
                    fill="#000000"
                    fillOpacity={0.4}
                    name="POS Revenue (Previous)"
                    hide={!visibleSeries.posRevenue}
                    barSize={30}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="previousEatclubRevenue"
                    stackId="previous"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                    name="Eatclub Revenue (Previous)"
                    hide={!visibleSeries.eatclubRevenue}
                    barSize={30}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="previousLabourCosts"
                    stackId="labourPrevious"
                    fill="#f97316"
                    fillOpacity={0.4}
                    name="Labour Costs (Previous)"
                    hide={!visibleSeries.labourCosts}
                    barSize={30}
                    radius={[6, 6, 0, 0]}
                  />
                </>
              )}

              {trendMarkers.map((marker) => (
                <ReferenceDot
                  key={marker.day}
                  x={marker.day}
                  y={marker.y}
                  r={0}
                  shape={(props) => (
                    <TrendIconMarker {...props} type={marker.type} />
                  )}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-black rounded-full"></span>
            <span>POS Revenue (Current)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span>Eatclub Revenue (Current)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span>Labour Costs (Current)</span>
          </div>
          {compareToPrevious && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-black opacity-30 rounded-full"></span>
                <span>POS Revenue (Previous)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-300 rounded-full"></span>
                <span>Eatclub Revenue (Previous)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-300 rounded-full"></span>
                <span>Labour Costs (Previous)</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Positive Event Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span>Negative Event Impact</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;
