"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/accounts/api/get-accounts";
import { MOCK_ACCOUNTS_RESPONSE } from "@/features/accounts/data/mock-accounts";

export function useAccounts() {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    retry: false,
    placeholderData: MOCK_ACCOUNTS_RESPONSE,
  });

  return {
    ...query,
    data: query.data ?? MOCK_ACCOUNTS_RESPONSE,
    isUsingFallback: query.isError,
  };
}
