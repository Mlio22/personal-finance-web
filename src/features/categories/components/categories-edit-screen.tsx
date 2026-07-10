"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddCategoryCard } from "@/features/categories/components/add-category-card";
import { CategoriesKindTabs } from "@/features/categories/components/categories-kind-tabs";
import { CategoryCard } from "@/features/categories/components/category-card";
import { CategoryGridPlaceholder } from "@/features/categories/components/category-grid-placeholder";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useOverview } from "@/features/categories/hooks/use-overview";
import {
  CATEGORY_DONUT_CELL_CLASS,
  CATEGORY_GRID_CLASS,
  partitionCategoryGrid,
} from "@/features/categories/lib/category-grid-layout";
import type {
  CategoryKind,
} from "@/features/categories/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getBottomCardPlacement(index: number) {
  return { gridColumnStart: index + 1, className: undefined };
}

export function CategoriesEditScreen({
  onExit,
}: {
  onExit: () => void;
}) {
  const router = useRouter();
  const { data: summaryData, isLoading: isSummaryLoading } =
    useCategoriesSummary();
  const { data: overviewData, isLoading: isOverviewLoading } = useOverview();
  const [activeKind, setActiveKind] = useState<CategoryKind>("expense");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const categories = useMemo(() => {
    const all = summaryData?.categories ?? [];
    return all.filter(
      (category) =>
        !(category.archived ?? false) &&
        (category.kind ?? "expense") === activeKind,
    );
  }, [summaryData?.categories, activeKind]);

  const handleSelect = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);
      router.push(`/categories/${categoryId}/edit`);
    },
    [router],
  );

  const handleAdd = useCallback(() => {
    router.push(`/categories/new?kind=${activeKind}`);
  }, [router, activeKind]);

  if ((isSummaryLoading || isOverviewLoading) && categories.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="h-24 animate-pulse rounded-xl bg-muted/60" />
      </div>
    );
  }

  const { top, middleLeft, middleRight, bottom, overflow } =
    partitionCategoryGrid(categories);
  const filledBottomCount = bottom.filter(Boolean).length;
  const showAddInBottom = filledBottomCount < 4;
  const showAddInOverflow = !showAddInBottom;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="mb-2 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Back"
          onClick={onExit}
        >
          <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          Edit categories
        </h1>
      </header>

      <CategoriesKindTabs
        activeKind={activeKind}
        onKindChange={setActiveKind}
      />

      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 pb-1">
        <div className={CATEGORY_GRID_CLASS}>
          {top.map((category, index) =>
            category ? (
              <CategoryCard
                key={category.id}
                category={category}
                density="edge"
                highlighted={selectedCategoryId === category.id}
                onSelect={handleSelect}
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
              onSelect={handleSelect}
              className="col-start-1 row-start-2 self-center"
            />
          ) : (
            <CategoryGridPlaceholder
              density="flank"
              className="col-start-1 row-start-2 self-center"
            />
          )}

          <div className={CATEGORY_DONUT_CELL_CLASS}>
            <div className="absolute inset-0 flex items-center justify-center">
              <ExpenseDonutChart
                categories={categories}
                totalExpenses={overviewData?.expenses ?? 0}
                totalIncome={overviewData?.income ?? 0}
                viewKind={activeKind}
                selectedCategoryId={selectedCategoryId}
                onToggleKind={() =>
                  setActiveKind((current) =>
                    current === "expense" ? "income" : "expense",
                  )
                }
                className="aspect-square size-full max-h-full max-w-full"
              />
            </div>
          </div>

          {middleRight[0] ? (
            <CategoryCard
              category={middleRight[0]}
              density="flank"
              highlighted={selectedCategoryId === middleRight[0].id}
              onSelect={handleSelect}
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
              onSelect={handleSelect}
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
              onSelect={handleSelect}
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

            if (category) {
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  density="edge"
                  highlighted={selectedCategoryId === category.id}
                  onSelect={handleSelect}
                  className={cn("row-start-4 self-center", placement.className)}
                  style={{ gridColumnStart: placement.gridColumnStart }}
                />
              );
            }

            if (showAddInBottom && index === filledBottomCount) {
              return (
                <AddCategoryCard
                  key="add-category"
                  onClick={handleAdd}
                  className={cn("row-start-4 self-center", placement.className)}
                  style={{ gridColumnStart: placement.gridColumnStart }}
                />
              );
            }

            return (
              <CategoryGridPlaceholder
                key={`bottom-${index}`}
                density="edge"
                className={cn("row-start-4 self-center", placement.className)}
                style={{ gridColumnStart: placement.gridColumnStart }}
              />
            );
          })}
        </div>

        {overflow.length > 0 || showAddInOverflow ? (
          <div className="grid shrink-0 grid-cols-4 gap-1">
            {overflow.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                density="edge"
                highlighted={selectedCategoryId === category.id}
                onSelect={handleSelect}
              />
            ))}
            {showAddInOverflow ? (
              <AddCategoryCard onClick={handleAdd} />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
