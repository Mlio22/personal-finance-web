import { buildMockTransactionsResponse } from "@/features/transactions/data/mock-transactions";
import type { TransactionsResponse } from "@/features/transactions/types";
import { apiClient } from "@/lib/api-client";
import { buildPeriodQueryString } from "@/lib/period-query-params";
import type { PeriodRange } from "@/features/period/types";

export interface GetTransactionsParams {
  range: PeriodRange;
  accountId?: string;
  categoryId?: string;
}

function buildTransactionsQueryString({
  range,
  accountId,
  categoryId,
}: GetTransactionsParams): string {
  const base = buildPeriodQueryString(range, accountId);
  if (!categoryId) return base;

  const separator = base ? "&" : "?";
  return `${base}${separator}categoryId=${encodeURIComponent(categoryId)}`;
}

export async function getTransactions(
  params: GetTransactionsParams,
): Promise<TransactionsResponse> {
  try {
    return await apiClient.get<TransactionsResponse>(
      `/v1/transactions${buildTransactionsQueryString(params)}`,
    );
  } catch {
    return buildMockTransactionsResponse({
      periodStart: params.range.start ?? undefined,
      periodEnd: params.range.end ?? undefined,
      accountId: params.accountId,
      categoryId: params.categoryId,
    });
  }
}
