import {
  type RevenueSeriesVisibility,
  type RevenueWeekData,
  type RevenueComparisonSummary,
  type RevenueSummarySnapshot,
  type WeekdayRevenue,
  type EventImpact,
} from "@/interfaces/revenue";

const CURRENT_WEEK_DATA: WeekdayRevenue[] = [
  { day: "Mon", posRevenue: 1700, eatclubRevenue: 500, labourCosts: 600 },
  { day: "Tue", posRevenue: 1800, eatclubRevenue: 400, labourCosts: 650 },
  { day: "Wed", posRevenue: 1900, eatclubRevenue: 350, labourCosts: 800 },
  { day: "Thu", posRevenue: 2000, eatclubRevenue: 250, labourCosts: 700 },
  { day: "Fri", posRevenue: 1950, eatclubRevenue: 300, labourCosts: 650 },
  { day: "Sat", posRevenue: 2400, eatclubRevenue: 450, labourCosts: 800 },
  { day: "Sun", posRevenue: 2500, eatclubRevenue: 450, labourCosts: 1100 },
];

const PREVIOUS_WEEK_DATA: WeekdayRevenue[] = [
  { day: "Mon", posRevenue: 1600, eatclubRevenue: 550, labourCosts: 650 },
  { day: "Tue", posRevenue: 1750, eatclubRevenue: 350, labourCosts: 600 },
  { day: "Wed", posRevenue: 1650, eatclubRevenue: 400, labourCosts: 750 },
  { day: "Thu", posRevenue: 1550, eatclubRevenue: 300, labourCosts: 550 },
  { day: "Fri", posRevenue: 1800, eatclubRevenue: 300, labourCosts: 600 },
  { day: "Sat", posRevenue: 2200, eatclubRevenue: 500, labourCosts: 750 },
  { day: "Sun", posRevenue: 2300, eatclubRevenue: 400, labourCosts: 850 },
];

const sumWeeklyRevenue = (week: WeekdayRevenue[]) =>
  week.reduce((sum, day) => sum + day.posRevenue + day.eatclubRevenue, 0);

const buildSummary = (
  week: WeekdayRevenue[],
  totalCovers: number
): RevenueSummarySnapshot => {
  const totalRevenue = sumWeeklyRevenue(week);
  const averagePerDay = Math.round(totalRevenue / week.length);

  return {
    totalRevenue,
    averagePerDay,
    totalCovers,
  };
};

export const mockRevenueWeekData: RevenueWeekData = {
  currentWeek: CURRENT_WEEK_DATA,
  previousWeek: PREVIOUS_WEEK_DATA,
};

export const defaultRevenueSeriesVisibility: RevenueSeriesVisibility = {
  posRevenue: true,
  eatclubRevenue: true,
  labourCosts: true,
};

export const mockEventImpacts: EventImpact[] = [
  {
    day: "Tue",
    type: "positive",
    description: "Local festival - increased foot traffic",
    impactValue: 500,
  },
  {
    day: "Fri",
    type: "negative",
    description: "Staff shortage - reduced service capacity",
    impactValue: -1200,
  },
];

export const mockRevenueSummary: RevenueComparisonSummary = {
  current: buildSummary(CURRENT_WEEK_DATA, 911),
  previous: buildSummary(PREVIOUS_WEEK_DATA, 837),
};
