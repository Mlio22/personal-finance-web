import type { BudgetRemainingPillVariant } from "@/features/budget/types";
import { BUDGET_PILL_COLORS } from "@/features/budget/lib/budget-display";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface BudgetRemainingPillProps {
  amount: number;
  variant: BudgetRemainingPillVariant;
  className?: string;
}

export function BudgetRemainingPill({
  amount,
  variant,
  className,
}: BudgetRemainingPillProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none text-background",
        className,
      )}
      style={{ backgroundColor: BUDGET_PILL_COLORS[variant] }}
    >
      {formatIdr(amount)}
    </span>
  );
}
