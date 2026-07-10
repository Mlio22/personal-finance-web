"use client";

import { useQuery } from "@tanstack/react-query";
import { getOverview } from "@/features/categories/api/get-overview";
import { MOCK_OVERVIEW } from "@/features/categories/data/mock-overview-data";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { usePeriod } from "@/features/period/context/period-provider";

export function useOverview() {
  const { range } = usePeriod();
  const { selectedAccountId } = useAccountFilter();

  return useQuery({
    queryKey: [
      "overview",
      {
        accountId: selectedAccountId,
        start: range.start?.toISOString() ?? null,
        end: range.end?.toISOString() ?? null,
      },
    ],
    queryFn: () =>
      getOverview({
        range,
        accountId: selectedAccountId,
      }),
    placeholderData: MOCK_OVERVIEW,
  });
}
