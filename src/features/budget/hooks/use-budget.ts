"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "@/features/budget/api/get-budgets";
import { getCategoriesSummary } from "@/features/categories/api/get-categories-summary";
import type {
  BudgetCategoryItem,
  BudgetsResponse,
} from "@/features/budget/types";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { useLockedCalendarMonthPeriod } from "@/features/period/context/period-provider";

function mergeSpentAmounts(
  budgets: BudgetsResponse,
  spentByCategoryId: Map<string, number>,
): BudgetsResponse {
  const mergeCategory = (category: BudgetCategoryItem): BudgetCategoryItem => ({
    ...category,
    spentAmount: spentByCategoryId.get(category.id) ?? category.spentAmount,
  });

  const categories = budgets.expenses.categories.map(mergeCategory);
  const subCategories = budgets.expenses.subCategories.map(mergeCategory);
  const hiddenSubCategories =
    budgets.expenses.hiddenSubCategories.map(mergeCategory);

  const totalSpent = categories.reduce(
    (sum, category) => sum + category.spentAmount,
    0,
  );
  const totalBudgeted = categories.reduce(
    (sum, category) => sum + category.budgetedAmount,
    0,
  );

  return {
    ...budgets,
    expenses: {
      ...budgets.expenses,
      categories,
      subCategories,
      hiddenSubCategories,
      totalSpent,
      totalBudgeted,
      totalRemaining: totalBudgeted - totalSpent,
    },
  };
}

export function useBudget() {
  const { range } = useLockedCalendarMonthPeriod();
  const { selectedAccountId } = useAccountFilter();

  const queryKey = {
    accountId: selectedAccountId,
    start: range.start?.toISOString() ?? null,
    end: range.end?.toISOString() ?? null,
  };

  const budgetsQuery = useQuery({
    queryKey: ["budgets", queryKey],
    queryFn: () =>
      getBudgets({
        range,
        accountId: selectedAccountId,
      }),
  });

  const summaryQuery = useQuery({
    queryKey: ["categories", "summary", queryKey],
    queryFn: () =>
      getCategoriesSummary({
        range,
        accountId: selectedAccountId,
      }),
  });

  const data = useMemo(() => {
    if (!budgetsQuery.data) {
      return undefined;
    }

    const spentByCategoryId = new Map(
      (summaryQuery.data?.categories ?? []).map((category) => [
        category.id,
        category.spentAmount,
      ]),
    );

    return mergeSpentAmounts(budgetsQuery.data, spentByCategoryId);
  }, [budgetsQuery.data, summaryQuery.data]);

  return {
    data,
    isLoading: budgetsQuery.isLoading || summaryQuery.isLoading,
    isUsingFallback: budgetsQuery.isError || summaryQuery.isError,
  };
}
