"use client";

import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddCategoryCard } from "@/features/categories/components/add-category-card";
import { CategoriesKindTabs } from "@/features/categories/components/categories-kind-tabs";
import { CategoryCard } from "@/features/categories/components/category-card";
import { ExpenseDonutChart } from "@/features/categories/components/expense-donut-chart";
import { useCategoriesSummary } from "@/features/categories/hooks/use-categories-summary";
import { useOverview } from "@/features/categories/hooks/use-overview";
import type {
  CategoryKind,
  CategorySummaryItem,
} from "@/features/categories/types";
import { Button } from "@/components/ui/button";

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
    partitionCategories(categories);
  const showAddInBottom = bottom.length < 4;
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
        <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-[auto_1fr_1fr_auto] gap-1">
          {top.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              density="edge"
              highlighted={selectedCategoryId === category.id}
              onSelect={handleSelect}
              className="row-start-1"
              style={{ gridColumnStart: index + 1 }}
            />
          ))}

          {middleLeft[0] ? (
            <CategoryCard
              category={middleLeft[0]}
              density="flank"
              highlighted={selectedCategoryId === middleLeft[0].id}
              onSelect={handleSelect}
              className="col-start-1 row-start-2 self-center"
            />
          ) : null}

          <div className="col-span-2 row-span-2 col-start-2 row-start-2 flex min-h-0 min-w-0 items-center justify-center">
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
              className="aspect-square h-full w-full max-h-full max-w-full"
            />
          </div>

          {middleRight[0] ? (
            <CategoryCard
              category={middleRight[0]}
              density="flank"
              highlighted={selectedCategoryId === middleRight[0].id}
              onSelect={handleSelect}
              className="col-start-4 row-start-2 self-center"
            />
          ) : null}

          {middleLeft[1] ? (
            <CategoryCard
              category={middleLeft[1]}
              density="flank"
              highlighted={selectedCategoryId === middleLeft[1].id}
              onSelect={handleSelect}
              className="col-start-1 row-start-3 self-center"
            />
          ) : null}

          {middleRight[1] ? (
            <CategoryCard
              category={middleRight[1]}
              density="flank"
              highlighted={selectedCategoryId === middleRight[1].id}
              onSelect={handleSelect}
              className="col-start-4 row-start-3 self-center"
            />
          ) : null}

          {bottom.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              density="edge"
              highlighted={selectedCategoryId === category.id}
              onSelect={handleSelect}
              className="row-start-4 self-center"
              style={{ gridColumnStart: index + 1 }}
            />
          ))}

          {showAddInBottom ? (
            <AddCategoryCard
              onClick={handleAdd}
              className="row-start-4 self-center"
              style={{ gridColumnStart: bottom.length + 1 }}
            />
          ) : null}
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
