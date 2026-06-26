import { CreditCard } from "lucide-react";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import type { TransactionItem } from "@/features/transactions/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface TransactionRowProps {
  transaction: TransactionItem;
  onSelect?: (transaction: TransactionItem) => void;
}

function getCategoryLabel(transaction: TransactionItem): string {
  if (transaction.subcategoryName) {
    return `${transaction.categoryName} (${transaction.subcategoryName})`;
  }

  return transaction.categoryName;
}

function getAmountClassName(type: TransactionItem["type"]): string {
  if (type === "income") return "text-income";
  if (type === "expense") return "text-expense";
  return "text-foreground";
}

export function TransactionRow({ transaction, onSelect }: TransactionRowProps) {
  const amountClassName = getAmountClassName(transaction.type);
  const displayAmount =
    transaction.type === "expense"
      ? formatIdr(Math.abs(transaction.amount))
      : transaction.type === "income"
        ? `+${formatIdr(transaction.amount)}`
        : formatIdr(transaction.amount);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(transaction)}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/60"
    >
      <CategoryIcon
        icon={transaction.categoryIcon}
        color={transaction.categoryColor}
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {getCategoryLabel(transaction)}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <CreditCard className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{transaction.accountName}</span>
        </span>
        {transaction.note ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground/80">
            {transaction.note}
          </span>
        ) : null}
      </span>

      <span
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          amountClassName,
        )}
      >
        {displayAmount}
      </span>
    </button>
  );
}
