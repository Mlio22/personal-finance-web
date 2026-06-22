import { apiClient } from "@/lib/api-client";
import type { AccountsResponse } from "@/features/accounts/types";

export async function getAccounts(): Promise<AccountsResponse> {
  return apiClient.get<AccountsResponse>("/v1/accounts");
}
