export const REVENUE_SERIES_KEYS = [
  "posRevenue",
  "eatclubRevenue",
  "labourCosts",
] as const;

export type RevenueSeriesKey = (typeof REVENUE_SERIES_KEYS)[number];

export type RevenueSeriesVisibility = Record<RevenueSeriesKey, boolean>;

export interface WeekdayRevenue {
  day: string;
  posRevenue: number;
  eatclubRevenue: number;
  labourCosts: number;
}

export interface RevenueWeekData {
  currentWeek: WeekdayRevenue[];
  previousWeek: WeekdayRevenue[];
}

export interface RevenueSummarySnapshot {
  totalRevenue: number;
  averagePerDay: number;
  totalCovers: number;
}

export interface RevenueComparisonSummary {
  current: RevenueSummarySnapshot;
  previous: RevenueSummarySnapshot;
}

export type EventImpactType = "positive" | "negative";

export interface EventImpact {
  day: string;
  type: EventImpactType;
  description: string;
  impactValue?: number;
}
