"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/accounts/api/get-accounts";
import { EMPTY_ACCOUNTS_RESPONSE } from "@/features/accounts/data/mock-accounts";
import { getClientMockAccountsResponse } from "@/features/accounts/lib/account-store";
import type { AccountsResponse } from "@/features/accounts/types";

async function fetchAccountsOrMock(): Promise<{
  data: AccountsResponse;
  isUsingFallback: boolean;
}> {
  try {
    const data = await getAccounts();
    return { data, isUsingFallback: false };
  } catch {
    return {
      data: getClientMockAccountsResponse(),
      isUsingFallback: true,
    };
  }
}

export function useAccounts() {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccountsOrMock,
    retry: false,
  });

  const data = query.data?.data;
  const isUsingFallback = query.data?.isUsingFallback ?? false;

  return {
    ...query,
    data,
    isLoading: query.isLoading && !data,
    isUsingFallback,
    fallback: data ?? EMPTY_ACCOUNTS_RESPONSE,
  };
}
