"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryRemainingDisplay } from "@/features/categories/lib/category-display";
import type { CategorySummaryItem } from "@/features/categories/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: CategorySummaryItem;
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

function getCategoryDescription(
  category: CategorySummaryItem,
  isOverBudget: boolean,
  displayAmount: number,
  remaining: number,
): string {
  if (isOverBudget) {
    return `Over budget by ${formatCompactIdr(displayAmount)}`;
  }

  if (category.budgetedAmount > 0 && remaining > 0) {
    return `${formatCompactIdr(remaining)} remaining`;
  }

  if (category.budgetedAmount > 0 && remaining === 0) {
    return "Budget fully used";
  }

  if (category.budgetedAmount === 0 && category.spentAmount > 0) {
    return "No budget limit";
  }

  return "No spending this period";
}

export function CategoryCard({
  category,
  highlighted = false,
  onSelect,
  className,
  style,
}: CategoryCardProps) {
  const { displayAmount, isOverBudget, remaining } =
    getCategoryRemainingDisplay(category.budgetedAmount, category.spentAmount);
  const description = getCategoryDescription(
    category,
    isOverBudget,
    displayAmount,
    remaining,
  );

  return (
    <Link
      href={`/transactions?categoryId=${category.id}`}
      onClick={() => onSelect?.(category.id)}
      className={cn(
        "block min-w-0 rounded-xl px-1 py-2 text-left transition-colors hover:bg-muted/40",
        highlighted && "bg-muted/60 ring-1 ring-border/70",
        className,
      )}
      style={style}
      aria-label={`${category.name}, spent ${formatIdr(category.spentAmount)}, budgeted ${formatIdr(category.budgetedAmount)}`}
    >
      <div className="flex min-w-0 items-start gap-2">
        <CategoryIcon
          icon={category.icon}
          color={category.color}
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold leading-tight text-foreground">
            {category.name}
          </p>

          <div className="mt-1 flex items-baseline justify-between gap-2">
            <span
              className={cn(
                "shrink-0 text-[10px] font-semibold tabular-nums leading-none",
                category.spentAmount > 0 || isOverBudget
                  ? undefined
                  : "text-muted-foreground",
              )}
              style={
                category.spentAmount > 0 || isOverBudget
                  ? { color: category.color }
                  : undefined
              }
            >
              {formatCompactIdr(category.spentAmount)}
            </span>

            <span
              className={cn(
                "truncate text-right text-[10px] font-semibold tabular-nums leading-none",
                category.budgetedAmount > 0
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {formatCompactIdr(category.budgetedAmount)}
            </span>
          </div>

          <p className="mt-1 text-[9px] leading-snug wrap-break-word text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
