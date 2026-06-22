"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/features/transactions/api/get-transactions";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { usePeriod } from "@/features/period/context/period-provider";

export function useTransactions(categoryId?: string | null) {
  const { range } = usePeriod();
  const { selectedAccountId } = useAccountFilter();

  return useQuery({
    queryKey: [
      "transactions",
      {
        accountId: selectedAccountId,
        categoryId: categoryId ?? null,
        start: range.start?.toISOString() ?? null,
        end: range.end?.toISOString() ?? null,
      },
    ],
    queryFn: () =>
      getTransactions({
        range,
        accountId: selectedAccountId,
        categoryId: categoryId ?? undefined,
      }),
  });
}
