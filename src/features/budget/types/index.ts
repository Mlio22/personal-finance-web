export type BudgetCategoryVariant = "default" | "non-limit";

export interface BudgetCategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetedAmount: number;
  spentAmount: number;
  variant?: BudgetCategoryVariant;
}

export interface BudgetSavingsGoal {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetedAmount: number;
  depositedAmount: number;
}

export interface BudgetExpenseSection {
  categories: BudgetCategoryItem[];
  subCategories: BudgetCategoryItem[];
  hiddenSubCategories: BudgetCategoryItem[];
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
}

export interface BudgetSavingsSection {
  goals: BudgetSavingsGoal[];
  totalBudgeted: number;
  totalDeposited: number;
  totalRemaining: number;
}

export interface BudgetsResponse {
  expenses: BudgetExpenseSection;
  savings: BudgetSavingsSection;
}

export type BudgetRemainingPillVariant =
  | "default"
  | "over-budget"
  | "non-limit"
  | "savings";

export interface BudgetRemainingDisplay {
  remaining: number;
  displayAmount: number;
  pillVariant: BudgetRemainingPillVariant;
}
