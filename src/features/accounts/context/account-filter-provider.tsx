"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ALL_ACCOUNTS_FILTER_ID,
  getTotalBalance,
  MOCK_ACCOUNTS,
} from "@/features/accounts/data/mock-accounts";
import type { Account } from "@/features/accounts/types";

interface AccountFilterContextValue {
  accounts: Account[];
  selectedAccountId: string;
  selectedAccount: Account | null;
  displayLabel: string;
  displayBalance: number;
  setSelectedAccountId: (accountId: string) => void;
}

const AccountFilterContext = createContext<AccountFilterContextValue | null>(
  null,
);

export function AccountFilterProvider({ children }: { children: ReactNode }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    ALL_ACCOUNTS_FILTER_ID,
  );

  const accounts = MOCK_ACCOUNTS;
  const totalBalance = useMemo(() => getTotalBalance(accounts), [accounts]);

  const selectedAccount = useMemo(() => {
    if (selectedAccountId === ALL_ACCOUNTS_FILTER_ID) {
      return null;
    }

    return accounts.find((account) => account.id === selectedAccountId) ?? null;
  }, [accounts, selectedAccountId]);

  const displayLabel =
    selectedAccountId === ALL_ACCOUNTS_FILTER_ID
      ? "All accounts"
      : (selectedAccount?.name ?? "All accounts");

  const displayBalance = selectedAccount?.balance ?? totalBalance;

  const handleSetSelectedAccountId = useCallback((accountId: string) => {
    setSelectedAccountId(accountId);
  }, []);

  const value = useMemo(
    () => ({
      accounts,
      selectedAccountId,
      selectedAccount,
      displayLabel,
      displayBalance,
      setSelectedAccountId: handleSetSelectedAccountId,
    }),
    [
      accounts,
      selectedAccountId,
      selectedAccount,
      displayLabel,
      displayBalance,
      handleSetSelectedAccountId,
    ],
  );

  return (
    <AccountFilterContext.Provider value={value}>
      {children}
    </AccountFilterContext.Provider>
  );
}

export function useAccountFilter() {
  const context = useContext(AccountFilterContext);

  if (!context) {
    throw new Error("useAccountFilter must be used within AccountFilterProvider");
  }

  return context;
}
