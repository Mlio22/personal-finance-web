export type AccountType = "regular" | "savings" | "debt";

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: AccountType;
  color?: string;
  icon?: string;
  isSavingsGoal?: boolean;
  savingsTarget?: number;
  sortOrder?: number;
  isDefault?: boolean;
}

export interface AccountsTotals {
  accounts: number;
  savings: number;
}

export interface AccountsResponse {
  accounts: Account[];
  savings: Account[];
  totals: AccountsTotals;
}

export type AccountsSubTab = "accounts" | "debts" | "my-finances";
