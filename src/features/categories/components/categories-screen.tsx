"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { getAllAccounts } from "@/features/accounts/lib/account-store";
import { CategoriesEditScreen } from "@/features/categories/components/categories-edit-screen";
import { CategoryCard } from "@/features/categories/components/category-card";
import {
  CategoryExpenseDrawer,
  type CategoryExpenseConfirmPayload,
} from "@/features/categories/components/category-expense-drawer";
import { CategoryGridPlaceholder } from "@/features/categories/components/category-grid-placeholder";
import { CategoryUsageDrawer } from "@/features/categories/components/category-usage-drawer";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useCreateExpense } from "@/features/categories/hooks/use-create-expense";
import { useCreateIncome } from "@/features/categories/hooks/use-create-income";
import { useOverview } from "@/features/categories/hooks/use-overview";
import { partitionCategoryGrid } from "@/features/categories/lib/category-grid-layout";
import { resolveExpenseAccount } from "@/features/categories/lib/resolve-expense-account";
import type {
  CategoryKind,
  CategorySummaryItem,
} from "@/features/categories/types";
import { useRegisterHeaderAction } from "@/components/layout/header-action-provider";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const { accounts, selectedAccount } = useAccountFilter();
  const { data: accountsData } = useAccounts();
  const { data: summaryData, isLoading: isSummaryLoading } =
    useCategoriesSummary();
  const { data: overviewData, isLoading: isOverviewLoading } = useOverview();
  const { mutate: createExpense } = useCreateExpense();
  const { mutate: createIncome } = useCreateIncome();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId,
  );
  const [transactionCategory, setTransactionCategory] =
    useState<CategorySummaryItem | null>(null);
  const [transactionKind, setTransactionKind] = useState<CategoryKind>("expense");
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [usageCategory, setUsageCategory] =
    useState<CategorySummaryItem | null>(null);
  const [usageOpen, setUsageOpen] = useState(false);
  const [viewKind, setViewKind] = useState<CategoryKind>("expense");

  const toggleEditMode = useCallback(() => {
    if (isEditMode) {
      router.push("/categories");
      return;
    }
    router.push("/categories?edit=1");
  }, [isEditMode, router]);
  useRegisterHeaderAction("categories", toggleEditMode);

  const exitEditMode = useCallback(() => {
    router.push("/categories");
  }, [router]);

  const isLoading = isSummaryLoading || isOverviewLoading;
  const categories = useMemo(() => {
    const all = summaryData?.categories ?? [];
    return all.filter(
      (category) =>
        !(category.archived ?? false) &&
        (category.kind ?? "expense") === viewKind,
    );
  }, [summaryData?.categories, viewKind]);
  const expenseCategories = useMemo(() => {
    const all = summaryData?.categories ?? [];
    return all.filter(
      (category) =>
        !(category.archived ?? false) &&
        (category.kind ?? "expense") === "expense",
    );
  }, [summaryData?.categories]);
  const incomeCategories = useMemo(() => {
    const all = summaryData?.categories ?? [];
    return all.filter(
      (category) =>
        !(category.archived ?? false) &&
        (category.kind ?? "expense") === "income",
    );
  }, [summaryData?.categories]);

  const handleToggleKind = useCallback(() => {
    setViewKind((current) => (current === "expense" ? "income" : "expense"));
    setSelectedCategoryId(null);
    setTransactionOpen(false);
    setTransactionCategory(null);
    setUsageOpen(false);
    setUsageCategory(null);
  }, []);
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

      const kind = category.kind ?? "expense";
      setSelectedCategoryId(categoryId);
      setTransactionKind(kind);
      setTransactionCategory(category);
      setTransactionOpen(true);
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

  const handleTransactionOpenChange = useCallback((open: boolean) => {
    setTransactionOpen(open);
    if (!open) {
      setTransactionCategory(null);
    }
  }, []);

  const handleUsageOpenChange = useCallback((open: boolean) => {
    setUsageOpen(open);
    if (!open) {
      setUsageCategory(null);
    }
  }, []);

  const handleTransactionConfirm = useCallback(
    (payload: CategoryExpenseConfirmPayload) => {
      if (transactionKind === "income") {
        createIncome(payload);
        return;
      }

      createExpense(payload);
    },
    [createExpense, createIncome, transactionKind],
  );

  if (isEditMode) {
    return <CategoriesEditScreen onExit={exitEditMode} />;
  }

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <CategoriesSkeleton />
      </div>
    );
  }

  const { top, middleLeft, middleRight, bottom, overflow } =
    partitionCategoryGrid(categories);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-2 pb-1">
        <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-[auto_1fr_1fr_auto] gap-1">
          {top.map((category, index) =>
            category ? (
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
            ) : (
              <CategoryGridPlaceholder
                key={`top-${index}`}
                density="edge"
                className="row-start-1"
                style={{ gridColumnStart: index + 1 }}
              />
            ),
          )}

          {middleLeft[0] ? (
            <CategoryCard
              category={middleLeft[0]}
              density="flank"
              highlighted={selectedCategoryId === middleLeft[0].id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="col-start-1 row-start-2 self-center"
            />
          ) : (
            <CategoryGridPlaceholder
              density="flank"
              className="col-start-1 row-start-2 self-center"
            />
          )}

          <div className="col-span-2 row-span-2 col-start-2 row-start-2 flex min-h-0 min-w-0 items-center justify-center">
            <ExpenseDonutChart
              categories={categories}
              totalExpenses={overviewData?.expenses ?? 0}
              totalIncome={overviewData?.income ?? 0}
              viewKind={viewKind}
              selectedCategoryId={selectedCategoryId}
              onToggleKind={handleToggleKind}
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
          ) : (
            <CategoryGridPlaceholder
              density="flank"
              className="col-start-4 row-start-2 self-center"
            />
          )}

          {middleLeft[1] ? (
            <CategoryCard
              category={middleLeft[1]}
              density="flank"
              highlighted={selectedCategoryId === middleLeft[1].id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="col-start-1 row-start-3 self-center"
            />
          ) : (
            <CategoryGridPlaceholder
              density="flank"
              className="col-start-1 row-start-3 self-center"
            />
          )}

          {middleRight[1] ? (
            <CategoryCard
              category={middleRight[1]}
              density="flank"
              highlighted={selectedCategoryId === middleRight[1].id}
              onSelect={handleCategorySelect}
              onLongPress={handleCategoryLongPress}
              className="col-start-4 row-start-3 self-center"
            />
          ) : (
            <CategoryGridPlaceholder
              density="flank"
              className="col-start-4 row-start-3 self-center"
            />
          )}

          {bottom.map((category, index) => {
            const placement = getBottomCardPlacement(index);

            return category ? (
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
            ) : (
              <CategoryGridPlaceholder
                key={`bottom-${index}`}
                density="edge"
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
        open={transactionOpen}
        onOpenChange={handleTransactionOpenChange}
        category={transactionCategory}
        account={expenseAccount}
        accounts={spendableAccounts}
        categories={
          transactionKind === "income" ? incomeCategories : expenseCategories
        }
        transactionKind={transactionKind}
        onConfirm={handleTransactionConfirm}
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
