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
  | "qurban"
  | "piggy"
  | "briefcase"
  | "bank"
  | "coins"
  | "credit-card"
  | "gift"
  | "calculator"
  | "plant"
  | "safe"
  | "hand";

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: AccountType;
  color?: string;
  icon?: AccountIconKind;
  description?: string;
  creditLimit?: number;
  includeInTotalBalance?: boolean;
  isSavingsGoal?: boolean;
  savingsTarget?: number;
  goalLabel?: string;
  sortOrder?: number;
  isDefault?: boolean;
  archived?: boolean;
}

export type AccountFormMode = "create" | "edit";

export type NewAccountTypeOption = Extract<
  AccountType,
  "regular" | "debt" | "savings" | "investment"
>;

export interface AccountFormValues {
  name: string;
  type: AccountType;
  currency: string;
  description: string;
  balance: number;
  creditLimit: number;
  savingsTarget: number;
  includeInTotalBalance: boolean;
  archived: boolean;
  color: string;
  icon: AccountIconKind;
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
