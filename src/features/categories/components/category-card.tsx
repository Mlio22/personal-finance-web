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

export function CategoryCard({
  category,
  highlighted = false,
  onSelect,
  className,
  style,
}: CategoryCardProps) {
  const { displayAmount, isOverBudget, showHighlight } =
    getCategoryRemainingDisplay(category.budgetedAmount, category.spentAmount);

  return (
    <Link
      href={`/transactions?categoryId=${category.id}`}
      onClick={() => onSelect?.(category.id)}
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1 text-center transition-colors hover:bg-muted/40",
        highlighted && "bg-muted/60 ring-1 ring-border/70",
        className,
      )}
      style={style}
      aria-label={`${category.name}, remaining ${formatIdr(displayAmount)}, spent ${formatIdr(category.spentAmount)}`}
    >
      <span className="line-clamp-1 w-full text-[11px] font-semibold leading-tight text-foreground">
        {category.name}
      </span>

      {showHighlight ? (
        <span
          className={cn(
            "max-w-full truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums leading-none text-background",
            isOverBudget && "text-white",
          )}
          style={{ backgroundColor: category.color }}
        >
          {formatCompactIdr(displayAmount)}
        </span>
      ) : (
        <span className="text-[10px] font-medium tabular-nums leading-none text-muted-foreground">
          {formatCompactIdr(displayAmount)}
        </span>
      )}

      <CategoryIcon
        icon={category.icon}
        color={category.color}
        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
      />

      <span
        className={cn(
          "max-w-full truncate text-[10px] font-semibold tabular-nums leading-none",
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
    </Link>
  );
}
