"use client";

import { useState } from "react";
import { CategoryCard } from "@/features/categories/components/category-card";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useOverview } from "@/features/categories/hooks/use-overview";
import type { CategorySummaryItem } from "@/features/categories/types";

function partitionCategories(categories: CategorySummaryItem[]) {
  return {
    top: categories.slice(0, 4),
    middleLeft: [categories[4], categories[6]].filter(Boolean),
    middleRight: [categories[5], categories[7]].filter(Boolean),
    bottom: categories.slice(8, 12),
  };
}

function CategoriesSkeleton() {
  return (
    <div className="grid min-h-[calc(100dvh-12rem)] grid-cols-4 grid-rows-[4fr_2fr_2fr_4fr] gap-1.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`top-${index}`}
          className="animate-pulse rounded-xl bg-muted/60"
        />
      ))}
      <div className="col-start-1 row-start-2 animate-pulse rounded-xl bg-muted/60" />
      <div className="col-span-2 row-span-2 col-start-2 row-start-2 animate-pulse rounded-full bg-muted/60" />
      <div className="col-start-4 row-start-2 animate-pulse rounded-xl bg-muted/60" />
      <div className="col-start-1 row-start-3 animate-pulse rounded-xl bg-muted/60" />
      <div className="col-start-4 row-start-3 animate-pulse rounded-xl bg-muted/60" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`bottom-${index}`}
          className="row-start-4 animate-pulse rounded-xl bg-muted/60"
        />
      ))}
    </div>
  );
}

export function CategoriesScreen() {
  const { data: summaryData, isLoading: isSummaryLoading } =
    useCategoriesSummary();
  const { data: overviewData, isLoading: isOverviewLoading } = useOverview();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const isLoading = isSummaryLoading || isOverviewLoading;
  const categories = summaryData?.categories ?? [];

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  const { top, middleLeft, middleRight, bottom } =
    partitionCategories(categories);

  return (
    <div className="grid min-h-[calc(100dvh-12rem)] grid-cols-4 grid-rows-[4fr_2fr_2fr_4fr] gap-1.5">
      {top.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          highlighted={selectedCategoryId === category.id}
          onSelect={setSelectedCategoryId}
          className="row-start-1"
          style={{ gridColumnStart: index + 1 }}
        />
      ))}

      {middleLeft[0] ? (
        <CategoryCard
          category={middleLeft[0]}
          highlighted={selectedCategoryId === middleLeft[0].id}
          onSelect={setSelectedCategoryId}
          className="col-start-1 row-start-2"
        />
      ) : null}

      <div className="col-span-2 row-span-2 col-start-2 row-start-2 flex min-h-0 items-center justify-center">
        <ExpenseDonutChart
          categories={categories}
          totalExpenses={overviewData?.totalExpenses ?? 0}
          totalIncome={overviewData?.totalIncome ?? 0}
          selectedCategoryId={selectedCategoryId}
          onSegmentSelect={setSelectedCategoryId}
          className="size-full"
        />
      </div>

      {middleRight[0] ? (
        <CategoryCard
          category={middleRight[0]}
          highlighted={selectedCategoryId === middleRight[0].id}
          onSelect={setSelectedCategoryId}
          className="col-start-4 row-start-2"
        />
      ) : null}

      {middleLeft[1] ? (
        <CategoryCard
          category={middleLeft[1]}
          highlighted={selectedCategoryId === middleLeft[1].id}
          onSelect={setSelectedCategoryId}
          className="col-start-1 row-start-3"
        />
      ) : null}

      {middleRight[1] ? (
        <CategoryCard
          category={middleRight[1]}
          highlighted={selectedCategoryId === middleRight[1].id}
          onSelect={setSelectedCategoryId}
          className="col-start-4 row-start-3"
        />
      ) : null}

      {bottom.map((category, index) => (
        <CategoryCard
          key={category.id}
          category={category}
          highlighted={selectedCategoryId === category.id}
          onSelect={setSelectedCategoryId}
          className="row-start-4"
          style={{ gridColumnStart: index + 1 }}
        />
      ))}
    </div>
  );
}
