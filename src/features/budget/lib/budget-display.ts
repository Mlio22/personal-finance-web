import type {
  BudgetCategoryItem,
  BudgetRemainingDisplay,
  BudgetRemainingPillVariant,
  BudgetSavingsGoal,
} from "@/features/budget/types";

export function getExpenseRemainingDisplay(
  category: Pick<BudgetCategoryItem, "budgetedAmount" | "spentAmount" | "variant">,
): BudgetRemainingDisplay {
  const remaining = category.budgetedAmount - category.spentAmount;
  const isOverBudget = remaining < 0;

  let pillVariant: BudgetRemainingPillVariant = "default";

  if (category.variant === "non-limit") {
    pillVariant = "non-limit";
  } else if (isOverBudget) {
    pillVariant = "over-budget";
  }

  return {
    remaining,
    displayAmount: isOverBudget ? Math.abs(remaining) : Math.max(0, remaining),
    pillVariant,
  };
}

export function getSavingsRemainingDisplay(
  goal: Pick<BudgetSavingsGoal, "budgetedAmount" | "depositedAmount">,
): BudgetRemainingDisplay {
  const remaining = goal.budgetedAmount - goal.depositedAmount;

  return {
    remaining,
    displayAmount: Math.max(0, remaining),
    pillVariant: "savings",
  };
}

export const BUDGET_PILL_COLORS: Record<BudgetRemainingPillVariant, string> = {
  default: "#f472b6",
  "over-budget": "#ef4444",
  "non-limit": "#fbbf24",
  savings: "#f97316",
};
