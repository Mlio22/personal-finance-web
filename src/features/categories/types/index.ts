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

export interface DailyBreakdownAmounts {
  green: number;
  yellow: number;
  grey: number;
}

export interface DailyBreakdownItem {
  date: string;
  amounts: DailyBreakdownAmounts;
}

export interface OverviewAverages {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface OverviewResponse {
  balance: number;
  income: number;
  expenses: number;
  dailyBreakdown: DailyBreakdownItem[];
  averages: OverviewAverages;
  categoryBreakdown: CategoryBreakdownItem[];
  budgetRemaining: number;
  notificationCount: number;
}

export interface CategoryRemainingDisplay {
  remaining: number;
  isOverBudget: boolean;
  displayAmount: number;
  showHighlight: boolean;
}
