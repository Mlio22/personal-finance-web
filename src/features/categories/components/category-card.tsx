"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import { getCategoryRemainingDisplay } from "@/features/categories/lib/category-display";
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
  const { displayAmount, isOverBudget, showHighlight } =
    getCategoryRemainingDisplay(category.budgetedAmount, category.spentAmount);
  const isEdge = density === "edge";

  return (
    <Link
      href={`/transactions?categoryId=${category.id}`}
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
      aria-label={`${category.name}, remaining ${formatIdr(displayAmount)}, spent ${formatIdr(category.spentAmount)}`}
    >
      <span
        className={cn(
          "line-clamp-1 w-full font-semibold leading-tight text-foreground",
          isEdge ? "text-[10px]" : "text-[11px]",
        )}
      >
        {category.name}
      </span>

      {showHighlight ? (
        <span
          className={cn(
            "max-w-full truncate rounded-full px-2 py-0.5 font-semibold tabular-nums leading-none text-background",
            isEdge ? "text-[9px]" : "text-[10px]",
            isOverBudget && "text-white",
          )}
          style={{ backgroundColor: category.color }}
        >
          {formatCompactIdr(displayAmount)}
        </span>
      ) : (
        <span
          className={cn(
            "font-medium tabular-nums leading-none text-muted-foreground",
            isEdge ? "text-[9px]" : "text-[10px]",
          )}
        >
          {formatCompactIdr(displayAmount)}
        </span>
      )}

      <CategoryIcon
        icon={category.icon}
        color={category.color}
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
      />

      <span
        className={cn(
          "max-w-full truncate font-semibold tabular-nums leading-none",
          isEdge ? "text-[9px]" : "text-[10px]",
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
