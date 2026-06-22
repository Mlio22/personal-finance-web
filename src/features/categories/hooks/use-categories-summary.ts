"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriesSummary } from "@/features/categories/api/get-categories-summary";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { usePeriod } from "@/features/period/context/period-provider";

export function useCategoriesSummary() {
  const { range } = usePeriod();
  const { selectedAccountId } = useAccountFilter();

  return useQuery({
    queryKey: [
      "categories",
      "summary",
      {
        accountId: selectedAccountId,
        start: range.start?.toISOString() ?? null,
        end: range.end?.toISOString() ?? null,
      },
    ],
    queryFn: () =>
      getCategoriesSummary({
        range,
        accountId: selectedAccountId,
      }),
  });
}
