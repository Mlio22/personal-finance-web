export type AccountType = "regular" | "savings" | "investment" | "debt";

export type AccountIconKind =
  | "wallet"
  | "card"
  | "cash"
  | "sparkle"
  | "vault"
  | "chart"
  | "bars"
  | "dollar"
  | "gold"
  | "sos"
  | "travel"
  | "qurban";

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: AccountType;
  color?: string;
  icon?: AccountIconKind;
  isSavingsGoal?: boolean;
  savingsTarget?: number;
  goalLabel?: string;
  sortOrder?: number;
  isDefault?: boolean;
  archived?: boolean;
}

export interface AccountsTotals {
  accounts: number;
  savings: number;
  investments: number;
}

export interface AccountsResponse {
  accounts: Account[];
  savings: Account[];
  investments: Account[];
  archived: Account[];
  totals: AccountsTotals;
}

export type AccountsSubTab = "accounts" | "debts" | "my-finances";
