"use client";

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
}

export function CategoryCard({
  category,
  highlighted = false,
  onSelect,
  className,
}: CategoryCardProps) {
  const { displayAmount, isOverBudget, showHighlight } =
    getCategoryRemainingDisplay(category.budgetedAmount, category.spentAmount);

  return (
    <Link
      href={`/transactions?categoryId=${category.id}`}
      onClick={() => onSelect?.(category.id)}
      className={cn(
        "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-center transition-colors",
        highlighted && "bg-accent/60 ring-1 ring-border/80",
        className,
      )}
      aria-label={`${category.name}, remaining ${formatIdr(displayAmount)}, spent ${formatIdr(category.spentAmount)}`}
    >
      <span className="line-clamp-1 w-full text-[10px] font-medium leading-tight text-foreground">
        {category.name}
      </span>

      {showHighlight ? (
        <span
          className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none text-background"
          style={{ backgroundColor: category.color }}
        >
          {formatIdr(displayAmount)}
        </span>
      ) : (
        <span className="text-[9px] font-semibold leading-none text-muted-foreground">
          {formatIdr(displayAmount)}
        </span>
      )}

      <CategoryIcon
        icon={category.icon}
        color={category.color}
        className="flex size-7 shrink-0 items-center justify-center rounded-full"
      />

      <span
        className={cn(
          "text-[9px] font-semibold leading-none",
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
        {formatIdr(category.spentAmount)}
      </span>
    </Link>
  );
}
