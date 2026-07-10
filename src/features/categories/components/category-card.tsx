"use client";

import type { CSSProperties } from "react";
import { CategoryBudgetIcon } from "@/features/categories/components/category-budget-icon";
import {
  getCategoryRemainingDisplay,
  hasCategoryBudget,
} from "@/features/categories/lib/category-display";
import {
  CATEGORY_EDGE_SLOT_CLASS,
  CATEGORY_FLANK_SLOT_CLASS,
} from "@/features/categories/lib/category-grid-layout";
import type { CategorySummaryItem } from "@/features/categories/types";
import { useLongPress } from "@/hooks/use-long-press";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

type CategoryCardDensity = "edge" | "flank";

interface CategoryCardProps {
  category: CategorySummaryItem;
  density?: CategoryCardDensity;
  highlighted?: boolean;
  onSelect?: (categoryId: string) => void;
  onLongPress?: (categoryId: string) => void;
  className?: string;
  style?: CSSProperties;
}

export function CategoryCard({
  category,
  density = "flank",
  highlighted = false,
  onSelect,
  onLongPress,
  className,
  style,
}: CategoryCardProps) {
  const { isOverBudget } = getCategoryRemainingDisplay(
    category.budgetedAmount,
    category.spentAmount,
  );
  const hasBudget = hasCategoryBudget(category.budgetedAmount);
  const isEdge = density === "edge";
  const longPressHandlers = useLongPress({
    onPress: () => onSelect?.(category.id),
    onLongPress: onLongPress
      ? () => onLongPress(category.id)
      : undefined,
  });

  return (
    <button
      type="button"
      {...longPressHandlers}
      className={cn(
        "flex min-w-0 flex-col items-center rounded-xl text-center transition-colors hover:bg-muted/40 select-none",
        isEdge
          ? cn("gap-0.5 px-0.5 py-1", CATEGORY_EDGE_SLOT_CLASS)
          : cn(
              "h-full justify-center gap-0.5 px-0.5 py-1",
              CATEGORY_FLANK_SLOT_CLASS,
            ),
        highlighted && "bg-muted/60 ring-1 ring-border/70",
        className,
      )}
      style={style}
      aria-label={`${category.name}, spent ${formatIdr(category.spentAmount)}, budgeted ${formatIdr(category.budgetedAmount)}. Tap to add expense, hold for usage.`}
    >
      <span
        className={cn(
          "line-clamp-1 w-full font-semibold leading-tight text-foreground",
          isEdge ? "text-[11px]" : "text-xs",
        )}
      >
        {category.name}
      </span>

      <span
        className={cn(
          "max-w-full truncate font-medium tabular-nums leading-none text-muted-foreground",
          isEdge ? "text-[11px]" : "text-xs",
        )}
      >
        {formatIdr(category.spentAmount)}
      </span>

      <CategoryBudgetIcon
        icon={category.icon}
        color={category.color}
        budgetedAmount={category.budgetedAmount}
        spentAmount={category.spentAmount}
        className={isEdge ? "size-12" : "size-14"}
        glyphClassName={isEdge ? "size-5" : "size-6"}
      />

      <span
        className={cn(
          "max-w-full truncate font-semibold tabular-nums leading-none",
          isEdge ? "text-[11px]" : "text-xs",
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
          ? formatIdr(category.budgetedAmount)
          : formatIdr(category.spentAmount)}
      </span>
    </button>
  );
}
