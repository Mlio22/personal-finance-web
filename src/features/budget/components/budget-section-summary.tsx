import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface BudgetSectionSummaryProps {
  title: string;
  remainingLabel: string;
  remainingAmount: number;
  remainingClassName?: string;
  primarySubLabel: string;
  primaryAmount: number;
  secondarySubLabel: string;
  secondaryAmount: number;
}

export function BudgetSectionSummary({
  title,
  remainingLabel,
  remainingAmount,
  remainingClassName,
  primarySubLabel,
  primaryAmount,
  secondarySubLabel,
  secondaryAmount,
}: BudgetSectionSummaryProps) {
  return (
    <div className="space-y-1 px-1">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <div className="text-right">
          <p className="sr-only">{remainingLabel}</p>
          <p
            className={cn(
              "text-lg font-semibold leading-tight",
              remainingClassName,
            )}
          >
            {formatIdr(remainingAmount)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <span>
          {primarySubLabel} {formatIdr(primaryAmount)}
        </span>
        <span>
          {secondarySubLabel} {formatIdr(secondaryAmount)}
        </span>
      </div>
    </div>
  );
}
