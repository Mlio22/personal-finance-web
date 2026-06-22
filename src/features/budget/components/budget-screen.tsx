"use client";

import { useState } from "react";
import {
  BudgetCategoryRow,
  BudgetSavingsRow,
} from "@/features/budget/components/budget-category-row";
import { BudgetSectionSummary } from "@/features/budget/components/budget-section-summary";
import { BudgetSubcategoryGrid } from "@/features/budget/components/budget-subcategory-grid";
import { useBudget } from "@/features/budget/hooks/use-budget";

function BudgetSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex justify-between px-1">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex justify-between px-1">
          <div className="h-3 w-36 animate-pulse rounded bg-muted" />
          <div className="h-3 w-36 animate-pulse rounded bg-muted" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 px-1 py-2.5">
            <div className="size-8 animate-pulse rounded-full bg-muted" />
            <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function handleCategorySelect() {
  // Budget edit flow tracked as follow-up.
}

function handleSavingsSelect() {
  // Savings goal edit flow tracked as follow-up.
}

export function BudgetScreen() {
  const { data, isLoading, isUsingFallback } = useBudget();
  const [subCategoriesExpanded, setSubCategoriesExpanded] = useState(false);

  if (isLoading && !data) {
    return <BudgetSkeleton />;
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Budget unavailable</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Unable to load budget data for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-2">
      {isUsingFallback ? (
        <p className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs text-muted-foreground">
          Showing cached budget data. Connect the API to load live amounts.
        </p>
      ) : null}

      <section className="space-y-3">
        <BudgetSectionSummary
          title="Expenses"
          remainingLabel="Remaining budget"
          remainingAmount={data.expenses.totalRemaining}
          remainingClassName="text-expense"
          primarySubLabel="spent"
          primaryAmount={data.expenses.totalSpent}
          secondarySubLabel="budgeted"
          secondaryAmount={data.expenses.totalBudgeted}
        />

        <div className="space-y-0.5">
          {data.expenses.categories.map((category) => (
            <BudgetCategoryRow
              key={category.id}
              category={category}
              onSelect={handleCategorySelect}
            />
          ))}
        </div>

        <BudgetSubcategoryGrid
          categories={data.expenses.subCategories}
          hiddenCategories={data.expenses.hiddenSubCategories}
          expanded={subCategoriesExpanded}
          onToggleExpanded={() => setSubCategoriesExpanded((current) => !current)}
          onSelect={handleCategorySelect}
        />
      </section>

      <section className="space-y-3">
        <BudgetSectionSummary
          title="Savings"
          remainingLabel="Remaining to save"
          remainingAmount={data.savings.totalRemaining}
          remainingClassName="text-[#f97316]"
          primarySubLabel="deposited"
          primaryAmount={data.savings.totalDeposited}
          secondarySubLabel="budgeted"
          secondaryAmount={data.savings.totalBudgeted}
        />

        <div className="space-y-0.5">
          {data.savings.goals.map((goal) => (
            <BudgetSavingsRow
              key={goal.id}
              goal={goal}
              onSelect={handleSavingsSelect}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
