"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { getAllAccounts } from "@/features/accounts/lib/account-store";
import { CategoryCard } from "@/features/categories/components/category-card";
import {
  CategoryExpenseDrawer,
  type CategoryExpenseConfirmPayload,
} from "@/features/categories/components/category-expense-drawer";
import { CategoryUsageDrawer } from "@/features/categories/components/category-usage-drawer";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useCreateExpense } from "@/features/categories/hooks/use-create-expense";
import { useOverview } from "@/features/categories/hooks/use-overview";
import { resolveExpenseAccount } from "@/features/categories/lib/resolve-expense-account";
import type { CategorySummaryItem } from "@/features/categories/types";
import { cn } from "@/lib/utils";

const MAIN_GRID_CAPACITY = 12;

function partitionCategories(categories: CategorySummaryItem[]) {
  const main = categories.slice(0, MAIN_GRID_CAPACITY);
  const overflow = categories.slice(MAIN_GRID_CAPACITY);

  return {
    top: main.slice(0, 4),
    middleLeft: [main[4], main[6]].filter(Boolean),
    middleRight: [main[5], main[7]].filter(Boolean),
    bottom: main.slice(8, 12),
    overflow,
  };
}

function getBottomCardPlacement(index: number) {
  return { gridColumnStart: index + 1, className: undefined };
}

function CategoriesSkeleton() {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-[auto_1fr_1fr_auto] gap-1">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`top-${index}`}
          className="h-24 animate-pulse rounded-xl bg-muted/60"
        />
      ))}
      <div className="col-start-1 row-start-2 h-28 animate-pulse rounded-xl bg-muted/60" />
      <div className="col-span-2 row-span-2 col-start-2 row-start-2 aspect-square w-full animate-pulse rounded-full bg-muted/60" />
      <div className="col-start-4 row-start-2 h-28 animate-pulse rounded-xl bg-muted/60" />
      <div className="col-start-1 row-start-3 h-28 animate-pulse rounded-xl bg-muted/60" />
      <div className="col-start-4 row-start-3 h-28 animate-pulse rounded-xl bg-muted/60" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`bottom-${index}`}
          className="row-start-4 h-24 animate-pulse rounded-xl bg-muted/60"
          style={{ gridColumnStart: index + 1 }}
        />
      ))}
    </div>
  );
}

export function CategoriesScreen({
  initialCategoryId = null,
}: {
  initialCategoryId?: string | null;
}) {
  const { accounts, selectedAccount } = useAccountFilter();
  const { data: accountsData } = useAccounts();
  const { data: summaryData, isLoading: isSummaryLoading } =
    useCategoriesSummary();
  const { data: overviewData, isLoading: isOverviewLoading } = useOverview();
  const { mutate: createExpense } = useCreateExpense();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId,
  );
  const [expenseCategory, setExpenseCategory] =
    useState<CategorySummaryItem | null>(null);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [usageCategory, setUsageCategory] =
    useState<CategorySummaryItem | null>(null);
  const [usageOpen, setUsageOpen] = useState(false);

  const isLoading = isSummaryLoading || isOverviewLoading;
  const categories = useMemo(
    () => summaryData?.categories ?? [],
    [summaryData?.categories],
  );
  const expenseAccount = useMemo(
    () => resolveExpenseAccount(accounts, selectedAccount),
    [accounts, selectedAccount],
  );
  const spendableAccounts = useMemo(() => {
    if (!accountsData) {
      return accounts;
    }

    return getAllAccounts(accountsData).filter((account) => !account.archived);
  }, [accounts, accountsData]);

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const category = categories.find((item) => item.id === categoryId);
      if (!category) {
        return;
      }

      setSelectedCategoryId(categoryId);
      setExpenseCategory(category);
      setExpenseOpen(true);
    },
    [categories],
  );

  const handleCategoryLongPress = useCallback(
    (categoryId: string) => {
      const category = categories.find((item) => item.id === categoryId);
      if (!category) {
        return;
      }

      setSelectedCategoryId(categoryId);
      setUsageCategory(category);
      setUsageOpen(true);
    },
    [categories],
  );

  const handleExpenseOpenChange = useCallback((open: boolean) => {
    setExpenseOpen(open);
    if (!open) {
      setExpenseCategory(null);
    }
  }, []);

  const handleUsageOpenChange = useCallback((open: boolean) => {
    setUsageOpen(open);
    if (!open) {
      setUsageCategory(null);
    }
  }, []);

  const handleExpenseConfirm = useCallback(
    (payload: CategoryExpenseConfirmPayload) => {
      createExpense(payload);
    },
    [createExpense],
  );

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <CategoriesSkeleton />
      </div>
    );
  }

  const { top, middleLeft, middleRight, bottom, overflow } =
    partitionCategories(categories);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-2 pb-1">
        <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-[auto_1fr_1fr_auto] gap-1">
          {top.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              density="edge"
              highlighted={selectedCategoryId === category.id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="row-start-1"
              style={{ gridColumnStart: index + 1 }}
            />
          ))}

          {middleLeft[0] ? (
            <CategoryCard
              category={middleLeft[0]}
              density="flank"
              highlighted={selectedCategoryId === middleLeft[0].id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="col-start-1 row-start-2 self-center"
            />
          ) : null}

          <div className="col-span-2 row-span-2 col-start-2 row-start-2 flex min-h-0 min-w-0 items-center justify-center">
            <ExpenseDonutChart
              categories={categories}
              totalExpenses={overviewData?.expenses ?? 0}
              totalIncome={overviewData?.income ?? 0}
              selectedCategoryId={selectedCategoryId}
              onSegmentSelect={handleCategorySelect}
              className="aspect-square h-full w-full max-h-full max-w-full"
            />
          </div>

          {middleRight[0] ? (
            <CategoryCard
              category={middleRight[0]}
              density="flank"
              highlighted={selectedCategoryId === middleRight[0].id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="col-start-4 row-start-2 self-center"
            />
          ) : null}

          {middleLeft[1] ? (
            <CategoryCard
              category={middleLeft[1]}
              density="flank"
              highlighted={selectedCategoryId === middleLeft[1].id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="col-start-1 row-start-3 self-center"
            />
          ) : null}

          {middleRight[1] ? (
            <CategoryCard
              category={middleRight[1]}
              density="flank"
              highlighted={selectedCategoryId === middleRight[1].id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="col-start-4 row-start-3 self-center"
            />
          ) : null}

          {bottom.map((category, index) => {
            const placement = getBottomCardPlacement(index);

            return (
              <CategoryCard
                key={category.id}
                category={category}
                density="edge"
                highlighted={selectedCategoryId === category.id}
                onSelect={handleCategorySelect}
                onLongPress={handleCategoryLongPress}
                className={cn("row-start-4 self-center", placement.className)}
                style={{ gridColumnStart: placement.gridColumnStart }}
              />
            );
          })}
        </div>

        {overflow.length > 0 ? (
          <div className="grid shrink-0 grid-cols-4 gap-1">
            {overflow.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                density="edge"
                highlighted={selectedCategoryId === category.id}
                onSelect={handleCategorySelect}
                onLongPress={handleCategoryLongPress}
              />
            ))}
          </div>
        ) : null}
      </div>

      <CategoryExpenseDrawer
        open={expenseOpen}
        onOpenChange={handleExpenseOpenChange}
        category={expenseCategory}
        account={expenseAccount}
        accounts={spendableAccounts}
        categories={categories}
        onConfirm={handleExpenseConfirm}
      />

      <CategoryUsageDrawer
        open={usageOpen}
        onOpenChange={handleUsageOpenChange}
        category={usageCategory}
        totalExpenses={overviewData?.expenses ?? 0}
      />
    </>
  );
}
