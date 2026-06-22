import { TransactionRow } from "@/features/transactions/components/transaction-row";
import { formatTransactionDateHeader } from "@/features/transactions/lib/format-transaction-date";
import type { TransactionDateGroup, TransactionItem } from "@/features/transactions/types";
import { formatIdr } from "@/lib/format-currency";

interface TransactionSectionProps {
  group: TransactionDateGroup;
  onTransactionSelect?: (transaction: TransactionItem) => void;
}

export function TransactionSection({
  group,
  onTransactionSelect,
}: TransactionSectionProps) {
  return (
    <section className="space-y-0.5">
      <div className="flex items-baseline justify-between px-3 py-2">
        <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {formatTransactionDateHeader(group.date)}
        </h2>
        {group.dailyExpenseTotal > 0 ? (
          <span className="text-sm font-semibold text-expense">
            {formatIdr(group.dailyExpenseTotal)}
          </span>
        ) : null}
      </div>

      <div className="space-y-0.5">
        {group.transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            onSelect={onTransactionSelect}
          />
        ))}
      </div>
    </section>
  );
}
