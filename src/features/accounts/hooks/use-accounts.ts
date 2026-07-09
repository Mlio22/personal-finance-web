"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/accounts/api/get-accounts";
import {
  EMPTY_ACCOUNTS_RESPONSE,
  getClientMockAccountsResponse,
} from "@/features/accounts/data/mock-accounts";
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

  const data = query.data ?? mockData ?? undefined;

  return {
    ...query,
    data,
    isLoading: (query.isLoading && !data) || mockData === null,
    isUsingFallback: query.isError,
    fallback: mockData ?? EMPTY_ACCOUNTS_RESPONSE,
  };
}
