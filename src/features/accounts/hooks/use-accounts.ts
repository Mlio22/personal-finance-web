"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/accounts/api/get-accounts";
import { EMPTY_ACCOUNTS_RESPONSE } from "@/features/accounts/data/mock-accounts";
import { getClientMockAccountsResponse } from "@/features/accounts/lib/account-store";
import type { AccountsResponse } from "@/features/accounts/types";

export function useAccounts() {
  const [mockData, setMockData] = useState<AccountsResponse | null>(null);

  useEffect(() => {
    // Generate once per browser session (shared singleton) after mount.
    setMockData(getClientMockAccountsResponse());
  }, []);

  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    retry: false,
    placeholderData: mockData ?? undefined,
  });

  // Prefer live API data; fall back to the shared session mock cache.
  const data = query.isError
    ? (mockData ?? undefined)
    : (query.data ?? mockData ?? undefined);

  return {
    ...query,
    data,
    isLoading: (query.isLoading && !data) || mockData === null,
    isUsingFallback: query.isError,
    fallback: mockData ?? EMPTY_ACCOUNTS_RESPONSE,
    refreshMockData: () => setMockData(getClientMockAccountsResponse()),
  };
}
