"use client";

import type { CSSProperties } from "react";
import { CategoryBudgetIcon } from "@/features/categories/components/category-budget-icon";
import {
  getCategoryRemainingDisplay,
  hasCategoryBudget,
} from "@/features/categories/lib/category-display";
import type { CategorySummaryItem } from "@/features/categories/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

type CategoryCardDensity = "edge" | "flank";

interface CategoryCardProps {
  category: CategorySummaryItem;
  density?: CategoryCardDensity;
  highlighted?: boolean;
  onSelect?: (categoryId: string) => void;
  className?: string;
  style?: CSSProperties;
}

function formatCompactIdr(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const label = Number.isInteger(millions)
      ? String(millions)
      : millions.toFixed(1).replace(/\.0$/, "");
    return `IDR ${label}M`;
  }

  if (amount >= 10_000) {
    const thousands = amount / 1_000;
    const label = Number.isInteger(thousands)
      ? String(thousands)
      : thousands.toFixed(1).replace(/\.0$/, "");
    return `IDR ${label}K`;
  }

  return formatIdr(amount);
}

export function CategoryCard({
  category,
  density = "flank",
  highlighted = false,
  onSelect,
  className,
  style,
}: CategoryCardProps) {
  const { isOverBudget } = getCategoryRemainingDisplay(
    category.budgetedAmount,
    category.spentAmount,
  );
  const hasBudget = hasCategoryBudget(category.budgetedAmount);
  const isEdge = density === "edge";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(category.id)}
      className={cn(
        "flex min-w-0 flex-col items-center rounded-xl text-center transition-colors hover:bg-muted/40",
        isEdge
          ? "gap-1 px-0.5 py-1"
          : "h-full justify-center gap-1 px-0.5 py-1.5",
        highlighted && "bg-muted/60 ring-1 ring-border/70",
        className,
      )}
      style={style}
      aria-label={`${category.name}, spent ${formatIdr(category.spentAmount)}, budgeted ${formatIdr(category.budgetedAmount)}`}
    >
      <span
        className={cn(
          "line-clamp-1 w-full font-semibold leading-tight text-foreground",
          isEdge ? "text-[10px]" : "text-[11px]",
        )}
      >
        {category.name}
      </span>

      <span
        className={cn(
          "max-w-full truncate font-medium tabular-nums leading-none text-muted-foreground",
          isEdge ? "text-[9px]" : "text-[10px]",
        )}
      >
        {formatCompactIdr(category.spentAmount)}
      </span>

      <CategoryBudgetIcon
        icon={category.icon}
        color={category.color}
        budgetedAmount={category.budgetedAmount}
        spentAmount={category.spentAmount}
      />

      <span
        className={cn(
          "max-w-full truncate font-semibold tabular-nums leading-none",
          isEdge ? "text-[9px]" : "text-[10px]",
          hasBudget || category.spentAmount > 0 || isOverBudget
            ? undefined
            : "text-muted-foreground",
        )}
        style={
          hasBudget || category.spentAmount > 0 || isOverBudget
            ? { color: category.color }
            : undefined
        }
      >
        {hasBudget
          ? formatCompactIdr(category.budgetedAmount)
          : formatCompactIdr(category.spentAmount)}
      </span>
    </button>
  );
}
