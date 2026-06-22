"use client";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import { BudgetRemainingPill } from "@/features/budget/components/budget-remaining-pill";
import {
  getExpenseRemainingDisplay,
  getSavingsRemainingDisplay,
} from "@/features/budget/lib/budget-display";
import type {
  BudgetCategoryItem,
  BudgetSavingsGoal,
} from "@/features/budget/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface BudgetCategoryRowProps {
  category: BudgetCategoryItem;
  onSelect?: (category: BudgetCategoryItem) => void;
}

export function BudgetCategoryRow({
  category,
  onSelect,
}: BudgetCategoryRowProps) {
  const { displayAmount, pillVariant } = getExpenseRemainingDisplay(category);
  const hasSpent = category.spentAmount > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(category)}
      className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition-colors hover:bg-muted/50"
      aria-label={`${category.name}, spent ${formatIdr(category.spentAmount)}, budgeted ${formatIdr(category.budgetedAmount)}, remaining ${formatIdr(displayAmount)}`}
    >
      <CategoryIcon
        icon={category.icon}
        color={category.color}
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {category.name}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2 text-[10px]">
          <span
            className={cn(!hasSpent && "text-muted-foreground")}
            style={hasSpent ? { color: category.color } : undefined}
          >
            {formatIdr(category.spentAmount)}
          </span>
          <span className="text-muted-foreground">
            {formatIdr(category.budgetedAmount)}
          </span>
        </div>
      </div>

      <BudgetRemainingPill amount={displayAmount} variant={pillVariant} />
    </button>
  );
}

interface BudgetSavingsRowProps {
  goal: BudgetSavingsGoal;
  onSelect?: (goal: BudgetSavingsGoal) => void;
}

export function BudgetSavingsRow({ goal, onSelect }: BudgetSavingsRowProps) {
  const { displayAmount, pillVariant } = getSavingsRemainingDisplay(goal);
  const hasDeposited = goal.depositedAmount > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(goal)}
      className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition-colors hover:bg-muted/50"
      aria-label={`${goal.name}, deposited ${formatIdr(goal.depositedAmount)}, budgeted ${formatIdr(goal.budgetedAmount)}, remaining ${formatIdr(displayAmount)}`}
    >
      <CategoryIcon
        icon={goal.icon}
        color={goal.color}
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {goal.name}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2 text-[10px]">
          <span
            className={cn(!hasDeposited && "text-muted-foreground")}
            style={hasDeposited ? { color: goal.color } : undefined}
          >
            {formatIdr(goal.depositedAmount)}
          </span>
          <span className="text-muted-foreground">
            {formatIdr(goal.budgetedAmount)}
          </span>
        </div>
      </div>

      <BudgetRemainingPill amount={displayAmount} variant={pillVariant} />
    </button>
  );
}
