import {
  createMockAccountsResponse,
  EMPTY_ACCOUNTS_RESPONSE,
} from "@/features/accounts/data/mock-accounts";
import type {
  Account,
  AccountFormValues,
  AccountsResponse,
  AccountType,
} from "@/features/accounts/types";

let clientMockCache: AccountsResponse | null = null;

function sumIdrBalances(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (account.currency !== "IDR") {
      return sum;
    }
    if (account.includeInTotalBalance === false) {
      return sum;
    }
    return sum + account.balance;
  }, 0);
}

function recomputeTotals(response: AccountsResponse): AccountsResponse {
  return {
    ...response,
    totals: {
      accounts: sumIdrBalances(response.accounts),
      savings: sumIdrBalances(response.savings),
      investments: sumIdrBalances(response.investments),
    },
  };
}

function listKeyForType(type: AccountType): keyof AccountsResponse | null {
  switch (type) {
    case "regular":
    case "debt":
      return "accounts";
    case "savings":
      return "savings";
    case "investment":
      return "investments";
    default:
      return null;
  }
}

export function getAllAccounts(response: AccountsResponse): Account[] {
  return [
    ...response.accounts,
    ...response.savings,
    ...response.investments,
    ...response.archived,
  ];
}

export function findAccountById(
  response: AccountsResponse,
  accountId: string,
): Account | undefined {
  return getAllAccounts(response).find((account) => account.id === accountId);
}

/**
 * Returns a single randomized mock dataset for the current browser session.
 * Safe to call from multiple hooks — amounts stay consistent across the UI.
 * On the server, returns an empty shell to avoid hydration mismatches.
 */
export function getClientMockAccountsResponse(): AccountsResponse {
  if (typeof window === "undefined") {
    return EMPTY_ACCOUNTS_RESPONSE;
  }

  if (!clientMockCache) {
    clientMockCache = createMockAccountsResponse();
  }

  return clientMockCache;
}

export function getAccountBalanceFromMock(
  accountId?: string | null,
): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const response = getClientMockAccountsResponse();

  if (!accountId || accountId === "all") {
    return response.totals.accounts;
  }

  const account = findAccountById(response, accountId);
  return account?.balance ?? null;
}

function slugifyName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "account";
}

function formValuesToAccountFields(values: AccountFormValues) {
  const isSavingsLike =
    values.type === "savings" || values.type === "investment";

  return {
    name: values.name.trim() || "Untitled account",
    balance: values.balance,
    currency: values.currency,
    type: values.type,
    color: values.color,
    icon: values.icon,
    description: values.description.trim() || undefined,
    creditLimit:
      values.type === "debt" || values.type === "regular"
        ? values.creditLimit
        : undefined,
    includeInTotalBalance: values.includeInTotalBalance,
    archived: values.archived,
    isSavingsGoal: isSavingsLike ? values.savingsTarget > 0 : undefined,
    savingsTarget: isSavingsLike ? values.savingsTarget : undefined,
  };
}

export function createAccountFromForm(values: AccountFormValues): Account {
  const id = `${slugifyName(values.name)}-${Date.now().toString(36)}`;

  return {
    id,
    ...formValuesToAccountFields(values),
    sortOrder: Date.now(),
  };
}

export function applyFormValuesToAccount(
  account: Account,
  values: AccountFormValues,
): Account {
  return {
    ...account,
    ...formValuesToAccountFields(values),
    name: values.name.trim() || account.name,
  };
}

export function upsertAccountInMockCache(account: Account): AccountsResponse {
  const current = getClientMockAccountsResponse();
  const withoutAccount: AccountsResponse = {
    accounts: current.accounts.filter((item) => item.id !== account.id),
    savings: current.savings.filter((item) => item.id !== account.id),
    investments: current.investments.filter((item) => item.id !== account.id),
    archived: current.archived.filter((item) => item.id !== account.id),
    totals: current.totals,
  };

  const targetKey = account.archived
    ? "archived"
    : listKeyForType(account.type);

  if (!targetKey || targetKey === "totals") {
    clientMockCache = recomputeTotals(withoutAccount);
    return clientMockCache;
  }

  const nextList = [...withoutAccount[targetKey], account].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  clientMockCache = recomputeTotals({
    ...withoutAccount,
    [targetKey]: nextList,
  });

  return clientMockCache;
}

export function deleteAccountFromMockCache(accountId: string): AccountsResponse {
  const current = getClientMockAccountsResponse();

  clientMockCache = recomputeTotals({
    accounts: current.accounts.filter((item) => item.id !== accountId),
    savings: current.savings.filter((item) => item.id !== accountId),
    investments: current.investments.filter((item) => item.id !== accountId),
    archived: current.archived.filter((item) => item.id !== accountId),
    totals: current.totals,
  });

  return clientMockCache;
}

export function accountToFormValues(account: Account): AccountFormValues {
  return {
    name: account.name,
    type: account.type,
    currency: account.currency,
    description: account.description ?? "",
    balance: account.balance,
    creditLimit: account.creditLimit ?? 0,
    savingsTarget: account.savingsTarget ?? 0,
    includeInTotalBalance: account.includeInTotalBalance ?? true,
    archived: account.archived ?? false,
    color: account.color ?? "#3B82F6",
    icon: account.icon ?? "card",
  };
}

export function defaultFormValues(
  type: AccountType = "regular",
): AccountFormValues {
  return {
    name: "",
    type,
    currency: "IDR",
    description: "",
    balance: 0,
    creditLimit: 0,
    savingsTarget: 0,
    includeInTotalBalance: true,
    archived: false,
    color:
      type === "savings"
        ? "#EC4899"
        : type === "debt"
          ? "#F97316"
          : "#3B82F6",
    icon:
      type === "savings" ? "vault" : type === "debt" ? "cash" : "card",
  };
}
