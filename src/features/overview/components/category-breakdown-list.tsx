"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import type { CategoryBreakdownItem } from "@/features/categories/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface CategoryBreakdownListProps {
  categories: CategoryBreakdownItem[];
}

const VISIBLE_COUNT = 3;

export function CategoryBreakdownList({ categories }: CategoryBreakdownListProps) {
  const [expanded, setExpanded] = useState(false);

  const { visibleCategories, moreCategory } = useMemo(() => {
    if (expanded || categories.length <= VISIBLE_COUNT) {
      return { visibleCategories: categories, moreCategory: null };
    }

    const topCategories = categories.slice(0, VISIBLE_COUNT);
    const rest = categories.slice(VISIBLE_COUNT);
    const moreAmount = rest.reduce((sum, category) => sum + category.amount, 0);
    const morePercentage = rest.reduce(
      (sum, category) => sum + category.percentage,
      0,
    );

    const aggregatedMore: CategoryBreakdownItem = {
      categoryId: "more",
      name: "More...",
      icon: "ellipsis",
      color: "#9ca3af",
      amount: moreAmount,
      percentage: morePercentage,
    };

    return {
      visibleCategories: topCategories,
      moreCategory: aggregatedMore,
    };
  }, [categories, expanded]);

  const rows = moreCategory
    ? [...visibleCategories, moreCategory]
    : visibleCategories;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Spending by category</h2>

      <ul className="space-y-4">
        {rows.map((category) => {
          const isMoreRow = category.categoryId === "more";

          if (isMoreRow) {
            return (
              <li key="more">
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="w-full text-left"
                >
                  <CategoryBreakdownRow category={category} />
                </button>
              </li>
            );
          }

          return (
            <li key={category.categoryId}>
              <Link
                href={`/categories?categoryId=${category.categoryId}`}
                className="block rounded-xl transition-colors hover:bg-muted/40"
              >
                <CategoryBreakdownRow category={category} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CategoryBreakdownRow({
  category,
}: {
  category: CategoryBreakdownItem;
}) {
  return (
    <div className="space-y-2 px-1 py-1">
      <div className="flex items-center gap-3">
        <CategoryIcon
          icon={category.icon}
          color={category.color}
          className="flex size-8 shrink-0 items-center justify-center rounded-full"
        />

        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {category.name}
        </span>

        <span className="shrink-0 text-sm font-semibold">
          {formatIdr(category.amount)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full")}
            style={{
              width: `${Math.min(category.percentage, 100)}%`,
              backgroundColor: category.color,
            }}
          />
        </div>
        <span className="w-8 shrink-0 text-right text-xs text-muted-foreground">
          {category.percentage}%
        </span>
      </div>
    </div>
  );
}
