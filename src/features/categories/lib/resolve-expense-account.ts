import type { Account } from "@/features/accounts/types";

export function resolveExpenseAccount(
  accounts: Account[],
  selectedAccount: Account | null,
): Account | null {
  if (selectedAccount) {
    return selectedAccount;
  }

  return (
    accounts.find((account) => account.isDefault) ??
    accounts.find((account) => account.type === "regular") ??
    accounts[0] ??
    null
  );
}
