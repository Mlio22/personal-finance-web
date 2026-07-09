import { apiClient } from "@/lib/api-client";
import type { Account, AccountsResponse } from "@/features/accounts/types";

type RawAccountsResponse = Partial<AccountsResponse> & {
  accounts?: Account[];
  savings?: Account[];
};

function sumBalances(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (account.currency && account.currency !== "IDR") {
      return sum;
    }
    return sum + account.balance;
  }, 0);
}

export function normalizeAccountsResponse(
  raw: RawAccountsResponse,
): AccountsResponse {
  const accounts = raw.accounts ?? [];
  const savings = raw.savings ?? [];
  const investments = raw.investments ?? [];
  const archived = raw.archived ?? [];

  return {
    accounts,
    savings,
    investments,
    archived,
    totals: {
      accounts: raw.totals?.accounts ?? sumBalances(accounts),
      savings: raw.totals?.savings ?? sumBalances(savings),
      investments: raw.totals?.investments ?? sumBalances(investments),
    },
  };
}

export async function getAccounts(): Promise<AccountsResponse> {
  const raw = await apiClient.get<RawAccountsResponse>("/v1/accounts");
  return normalizeAccountsResponse(raw);
}
