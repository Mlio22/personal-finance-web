"use client";

import { ChevronDown } from "lucide-react";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import type { BudgetCategoryItem } from "@/features/budget/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface BudgetSubcategoryGridProps {
  categories: BudgetCategoryItem[];
  hiddenCategories: BudgetCategoryItem[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onSelect?: (category: BudgetCategoryItem) => void;
}

export function BudgetSubcategoryGrid({
  categories,
  hiddenCategories,
  expanded,
  onToggleExpanded,
  onSelect,
}: BudgetSubcategoryGridProps) {
  const visibleCategories = expanded
    ? [...categories, ...hiddenCategories]
    : categories;

  const moreSpent = hiddenCategories.reduce(
    (sum, category) => sum + category.spentAmount,
    0,
  );

  return (
    <div className="grid grid-cols-4 gap-1.5 pt-1">
      {visibleCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect?.(category)}
          className="flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-center transition-colors hover:bg-muted/50"
          aria-label={`${category.name}, spent ${formatIdr(category.spentAmount)}`}
        >
          <span className="line-clamp-1 w-full text-[10px] font-medium leading-tight text-foreground">
            {category.name}
          </span>
          <CategoryIcon
            icon={category.icon}
            color={category.color}
            className="flex size-7 shrink-0 items-center justify-center rounded-full"
          />
          <span
            className={cn(
              "text-[9px] font-semibold leading-none",
              category.spentAmount > 0 ? undefined : "text-muted-foreground",
            )}
            style={
              category.spentAmount > 0 ? { color: category.color } : undefined
            }
          >
            {formatIdr(category.spentAmount)}
          </span>
        </button>
      ))}

      {!expanded && hiddenCategories.length > 0 ? (
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-center transition-colors hover:bg-muted/50"
          aria-label={`Show ${hiddenCategories.length} more sub-categories`}
        >
          <span className="line-clamp-1 w-full text-[10px] font-medium leading-tight text-foreground">
            More...
          </span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </span>
          <span className="text-[9px] font-semibold leading-none text-muted-foreground">
            {formatIdr(moreSpent)}
          </span>
        </button>
      ) : null}
    </div>
  );
}
