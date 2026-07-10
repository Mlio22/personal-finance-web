"use client";

import {
  getCategoryBudgetFillPercent,
  hasCategoryBudget,
} from "@/features/categories/lib/category-display";
import { CategoryIconGlyph } from "@/features/categories/components/category-icon";
import { cn } from "@/lib/utils";

interface CategoryBudgetIconProps {
  icon: string;
  color: string;
  budgetedAmount: number;
  spentAmount: number;
  className?: string;
  glyphClassName?: string;
}

export function CategoryBudgetIcon({
  icon,
  color,
  budgetedAmount,
  spentAmount,
  className,
  glyphClassName,
}: CategoryBudgetIconProps) {
  const hasBudget = hasCategoryBudget(budgetedAmount);
  const fillPercent = getCategoryBudgetFillPercent(
    budgetedAmount,
    spentAmount,
  );
  const isFullyFilled = hasBudget && fillPercent >= 100;
  const isPartiallyFilled = hasBudget && fillPercent > 0 && fillPercent < 100;

  return (
    <span
      className={cn(
        "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2",
        className,
      )}
      style={{
        borderColor: color,
        backgroundColor: isFullyFilled ? color : "transparent",
      }}
      aria-hidden="true"
    >
      {isPartiallyFilled ? (
        <span
          className="absolute inset-x-0 bottom-0"
          style={{
            height: `${fillPercent}%`,
            backgroundColor: color,
          }}
        />
      ) : null}

      <CategoryIconGlyph
        icon={icon}
        className={cn("relative z-10 size-5 text-white", glyphClassName)}
      />
    </span>
  );
}
