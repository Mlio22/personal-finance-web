import { MOCK_BUDGETS } from "@/features/budget/data/mock-budget-data";
import type { BudgetsResponse } from "@/features/budget/types";
import { apiClient } from "@/lib/api-client";
import { buildPeriodQueryString } from "@/lib/period-query-params";
import type { PeriodRange } from "@/features/period/types";

export interface BudgetsParams {
  range: PeriodRange;
  accountId?: string;
}

export async function getBudgets({
  range,
  accountId,
}: BudgetsParams): Promise<BudgetsResponse> {
  try {
    return await apiClient.get<BudgetsResponse>(
      `/v1/budgets${buildPeriodQueryString(range, accountId)}`,
    );
  } catch {
    return MOCK_BUDGETS;
  }
}
