import {
  MOCK_CATEGORIES_SUMMARY,
} from "@/features/categories/data/mock-categories-data";
import type { CategoriesSummaryResponse } from "@/features/categories/types";
import { apiClient } from "@/lib/api-client";
import { buildPeriodQueryString } from "@/lib/period-query-params";
import type { PeriodRange } from "@/features/period/types";

export interface CategoriesSummaryParams {
  range: PeriodRange;
  accountId?: string;
}

export async function getCategoriesSummary({
  range,
  accountId,
}: CategoriesSummaryParams): Promise<CategoriesSummaryResponse> {
  try {
    return await apiClient.get<CategoriesSummaryResponse>(
      `/v1/categories/summary${buildPeriodQueryString(range, accountId)}`,
    );
  } catch {
    return MOCK_CATEGORIES_SUMMARY;
  }
}
