import type { CategoryRemainingDisplay } from "@/features/categories/types";

export function getCategoryRemainingDisplay(
  budgetedAmount: number,
  spentAmount: number,
): CategoryRemainingDisplay {
  const remaining = budgetedAmount - spentAmount;
  const isOverBudget = remaining < 0;

  return {
    remaining,
    isOverBudget,
    displayAmount: isOverBudget ? Math.abs(remaining) : Math.max(0, remaining),
    showHighlight: isOverBudget || remaining > 0,
  };
}

export function hasCategoryBudget(budgetedAmount: number): boolean {
  return budgetedAmount > 0;
}

export function getCategoryBudgetFillPercent(
  budgetedAmount: number,
  spentAmount: number,
): number {
  if (budgetedAmount <= 0) {
    return 0;
  }

  return Math.min(100, (spentAmount / budgetedAmount) * 100);
}
