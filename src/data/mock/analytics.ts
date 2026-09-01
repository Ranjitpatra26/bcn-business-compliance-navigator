export interface AnalyticsOverview {
  conversionRate: number;
  totalProfit: number;
  visitors: string;
  transactions: string;
  activeUsers: string;
  expenses: number;
  income: number;
}

export const mockAnalyticsOverview: AnalyticsOverview = {
  conversionRate: 2.3,
  totalProfit: 264.2, // In thousands
  visitors: "19K",
  transactions: "37K",
  activeUsers: "45K",
  expenses: 12450,
  income: 45200,
};
