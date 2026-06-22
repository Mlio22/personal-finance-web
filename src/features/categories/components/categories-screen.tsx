"use client";

import { useState } from "react";
import { CategoryCard } from "@/features/categories/components/category-card";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useOverview } from "@/features/categories/hooks/use-overview";

function CategoriesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`top-${index}`}
            className="h-24 animate-pulse rounded-xl bg-muted/60"
          />
        ))}
      </div>
      <div className="mx-auto size-[220px] animate-pulse rounded-full bg-muted/60" />
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`bottom-${index}`}
            className="h-24 animate-pulse rounded-xl bg-muted/60"
          />
        ))}
      </div>
    </div>
  );
}

export function CategoriesScreen({
  initialCategoryId = null,
}: {
  initialCategoryId?: string | null;
}) {
  const { data: summaryData, isLoading: isSummaryLoading } =
    useCategoriesSummary();
  const { data: overviewData, isLoading: isOverviewLoading } = useOverview();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId,
  );

  const isLoading = isSummaryLoading || isOverviewLoading;
  const categories = summaryData?.categories ?? [];

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  const topRow = categories.slice(0, 4);
  const leftColumn = [categories[4], categories[6]].filter(Boolean);
  const rightColumn = [categories[5], categories[7]].filter(Boolean);
  const bottomRow = categories.slice(8, 11);

  return (
    <div className="pb-2">
      <div className="grid grid-cols-4 gap-1.5">
        {topRow.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            highlighted={selectedCategoryId === category.id}
            onSelect={setSelectedCategoryId}
          />
        ))}

        {leftColumn[0] ? (
          <CategoryCard
            category={leftColumn[0]}
            highlighted={selectedCategoryId === leftColumn[0].id}
            onSelect={setSelectedCategoryId}
            className="col-start-1 row-start-2 row-span-2 self-center"
          />
        ) : null}

        <div className="col-span-2 row-span-4 row-start-2 flex items-center justify-center">
          <ExpenseDonutChart
            categories={categories}
            totalExpenses={overviewData?.expenses ?? 0}
            totalIncome={overviewData?.income ?? 0}
            selectedCategoryId={selectedCategoryId}
            onSegmentSelect={setSelectedCategoryId}
          />
        </div>

        {rightColumn[0] ? (
          <CategoryCard
            category={rightColumn[0]}
            highlighted={selectedCategoryId === rightColumn[0].id}
            onSelect={setSelectedCategoryId}
            className="col-start-4 row-start-2 row-span-2 self-center"
          />
        ) : null}

        {leftColumn[1] ? (
          <CategoryCard
            category={leftColumn[1]}
            highlighted={selectedCategoryId === leftColumn[1].id}
            onSelect={setSelectedCategoryId}
            className="col-start-1 row-start-4 row-span-2 self-center"
          />
        ) : null}

        {rightColumn[1] ? (
          <CategoryCard
            category={rightColumn[1]}
            highlighted={selectedCategoryId === rightColumn[1].id}
            onSelect={setSelectedCategoryId}
            className="col-start-4 row-start-4 row-span-2 self-center"
          />
        ) : null}

        {bottomRow.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            highlighted={selectedCategoryId === category.id}
            onSelect={setSelectedCategoryId}
            className={
              index === 0
                ? "col-start-1 row-start-6"
                : index === 1
                  ? "col-start-2 row-start-6"
                  : "col-span-2 col-start-3 row-start-6"
            }
          />
        ))}
      </div>
    </div>
  );
}
