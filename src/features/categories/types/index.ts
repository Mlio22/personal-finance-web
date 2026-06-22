export interface CategorySummaryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetedAmount: number;
  spentAmount: number;
}

export interface CategoriesSummaryResponse {
  categories: CategorySummaryItem[];
}

export interface OverviewResponse {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface CategoryRemainingDisplay {
  remaining: number;
  isOverBudget: boolean;
  displayAmount: number;
  showHighlight: boolean;
}
