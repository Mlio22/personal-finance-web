"use client";

import { useState } from "react";
import { CategoryCard } from "@/features/categories/components/category-card";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useOverview } from "@/features/categories/hooks/use-overview";
import type { CategorySummaryItem } from "@/features/categories/types";
import { cn } from "@/lib/utils";

const MAIN_GRID_CAPACITY = 12;

// Header (3.5rem) + period selector (~3.25rem) + main padding (2rem) + bottom nav (4.5rem)
const CATEGORIES_GRID_HEIGHT = "calc(100dvh - 13.75rem)";

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

function getBottomCardPlacement(index: number, total: number) {
  if (total === 3 && index === 2) {
    return { gridColumnStart: 3, className: "col-span-2" as const };
  }

  return { gridColumnStart: index + 1, className: undefined };
}

function CategoriesSkeleton() {
  return (
    <div
      className="grid grid-cols-4 grid-rows-[3fr_4fr_4fr_3fr] gap-2"
      style={{ height: CATEGORIES_GRID_HEIGHT }}
    >
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
          className={cn(
            "row-start-4 animate-pulse rounded-xl bg-muted/60",
            index === 2 && "col-span-2 col-start-3",
          )}
          style={index < 2 ? { gridColumnStart: index + 1 } : undefined}
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
  const { data: summaryData, isLoading: isSummaryLoading } =
    useCategoriesSummary();
  const { data: overviewData, isLoading: isOverviewLoading } = useOverview();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId,
  );

  const isLoading = isSummaryLoading || isOverviewLoading;
  const categories = summaryData?.categories ?? [];

  if (isLoading && categories.length === 0) {
    return <CategoriesSkeleton />;
  }

  const { top, middleLeft, middleRight, bottom, overflow } =
    partitionCategories(categories);

  return (
    <div className="space-y-3 pb-2">
      <div
        className="grid grid-cols-4 grid-rows-[3fr_4fr_4fr_3fr] gap-2"
        style={{ height: CATEGORIES_GRID_HEIGHT }}
      >
        {top.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            highlighted={selectedCategoryId === category.id}
            onSelect={setSelectedCategoryId}
            className="row-start-1 self-center"
            style={{ gridColumnStart: index + 1 }}
          />
        ))}

        {middleLeft[0] ? (
          <CategoryCard
            category={middleLeft[0]}
            highlighted={selectedCategoryId === middleLeft[0].id}
            onSelect={setSelectedCategoryId}
            className="col-start-1 row-start-2 self-center"
          />
        ) : null}

        <div className="col-span-2 row-span-2 col-start-2 row-start-2 flex min-h-0 min-w-0 items-center justify-center">
          <ExpenseDonutChart
            categories={categories}
            totalExpenses={overviewData?.expenses ?? 0}
            totalIncome={overviewData?.income ?? 0}
            selectedCategoryId={selectedCategoryId}
            onSegmentSelect={setSelectedCategoryId}
            className="aspect-square h-full w-full max-h-full max-w-full"
          />
        </div>

        {middleRight[0] ? (
          <CategoryCard
            category={middleRight[0]}
            highlighted={selectedCategoryId === middleRight[0].id}
            onSelect={setSelectedCategoryId}
            className="col-start-4 row-start-2 self-center"
          />
        ) : null}

        {middleLeft[1] ? (
          <CategoryCard
            category={middleLeft[1]}
            highlighted={selectedCategoryId === middleLeft[1].id}
            onSelect={setSelectedCategoryId}
            className="col-start-1 row-start-3 self-center"
          />
        ) : null}

        {middleRight[1] ? (
          <CategoryCard
            category={middleRight[1]}
            highlighted={selectedCategoryId === middleRight[1].id}
            onSelect={setSelectedCategoryId}
            className="col-start-4 row-start-3 self-center"
          />
        ) : null}

        {bottom.map((category, index) => {
          const placement = getBottomCardPlacement(index, bottom.length);

          return (
            <CategoryCard
              key={category.id}
              category={category}
              highlighted={selectedCategoryId === category.id}
              onSelect={setSelectedCategoryId}
              className={cn("row-start-4 self-center", placement.className)}
              style={{ gridColumnStart: placement.gridColumnStart }}
            />
          );
        })}
      </div>

      {overflow.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {overflow.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              highlighted={selectedCategoryId === category.id}
              onSelect={setSelectedCategoryId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
