import { AnalyticsOverview, mockAnalyticsOverview } from "@/data/mock/analytics";

export type { AnalyticsOverview };

/**
 * Service to retrieve analytics overview data.
 * Simulates a network request with a brief delay.
 */
export async function getOverviewStats(): Promise<AnalyticsOverview> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalyticsOverview);
    }, 800); // 800ms delay to simulate network latency
  });
}
