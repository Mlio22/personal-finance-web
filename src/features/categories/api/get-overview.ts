import { MOCK_OVERVIEW } from "@/features/categories/data/mock-overview-data";
import type { OverviewResponse } from "@/features/categories/types";
import { apiClient } from "@/lib/api-client";
import { buildPeriodQueryString } from "@/lib/period-query-params";
import type { PeriodRange } from "@/features/period/types";

export interface OverviewParams {
  range: PeriodRange;
  accountId?: string;
}

export async function getOverview({
  range,
  accountId,
}: OverviewParams): Promise<OverviewResponse> {
  try {
    return await apiClient.get<OverviewResponse>(
      `/v1/overview${buildPeriodQueryString(range, accountId)}`,
    );
  } catch {
    return MOCK_OVERVIEW;
  }
}
