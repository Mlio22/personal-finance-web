"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { CategoryCard } from "@/features/categories/components/category-card";
import {
  CategoryExpenseDrawer,
} from "@/features/categories/components/category-expense-drawer";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useOverview } from "@/features/categories/hooks/use-overview";
import { resolveExpenseAccount } from "@/features/categories/lib/resolve-expense-account";
import type { CategorySummaryItem } from "@/features/categories/types";
import { cn } from "@/lib/utils";

const MAIN_GRID_CAPACITY = 12;

// Header (3.5rem) + period selector (~3.25rem) + main padding (2rem) + bottom nav (4.5rem)
const CATEGORIES_GRID_MIN_HEIGHT = "calc(100dvh - 13.75rem)";

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
    <div
      className="grid grid-cols-4 grid-rows-[auto_1fr_1fr_auto] gap-1"
      style={{ minHeight: CATEGORIES_GRID_MIN_HEIGHT }}
    >
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
  const { data: summaryData, isLoading: isSummaryLoading } =
    useCategoriesSummary();
  const { data: overviewData, isLoading: isOverviewLoading } = useOverview();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId,
  );
  const [expenseCategory, setExpenseCategory] =
    useState<CategorySummaryItem | null>(null);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const isLoading = isSummaryLoading || isOverviewLoading;
  const categories = useMemo(
    () => summaryData?.categories ?? [],
    [summaryData?.categories],
  );
  const expenseAccount = useMemo(
    () => resolveExpenseAccount(accounts, selectedAccount),
    [accounts, selectedAccount],
  );

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

  const handleExpenseOpenChange = useCallback((open: boolean) => {
    setExpenseOpen(open);
    if (!open) {
      setExpenseCategory(null);
    }
  }, []);

  const handleExpenseConfirm = useCallback(() => {
    // Transaction create API is not wired yet — drawer confirms the entry flow.
  }, []);

  if (isLoading && categories.length === 0) {
    return <CategoriesSkeleton />;
  }

  const { top, middleLeft, middleRight, bottom, overflow } =
    partitionCategories(categories);

  return (
    <>
      <div className="space-y-2 pb-2">
        <div
          className="grid grid-cols-4 grid-rows-[auto_1fr_1fr_auto] gap-1"
          style={{ minHeight: CATEGORIES_GRID_MIN_HEIGHT }}
        >
          {top.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              density="edge"
              highlighted={selectedCategoryId === category.id}
              onSelect={handleCategorySelect}
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
              className="col-start-4 row-start-2 self-center"
            />
          ) : null}

          {middleLeft[1] ? (
            <CategoryCard
              category={middleLeft[1]}
              density="flank"
              highlighted={selectedCategoryId === middleLeft[1].id}
              onSelect={handleCategorySelect}
              className="col-start-1 row-start-3 self-center"
            />
          ) : null}

          {middleRight[1] ? (
            <CategoryCard
              category={middleRight[1]}
              density="flank"
              highlighted={selectedCategoryId === middleRight[1].id}
              onSelect={handleCategorySelect}
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
                className={cn("row-start-4 self-center", placement.className)}
                style={{ gridColumnStart: placement.gridColumnStart }}
              />
            );
          })}
        </div>

        {overflow.length > 0 ? (
          <div className="grid grid-cols-4 gap-1">
            {overflow.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                density="edge"
                highlighted={selectedCategoryId === category.id}
                onSelect={handleCategorySelect}
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
        onConfirm={handleExpenseConfirm}
      />
    </>
  );
}
