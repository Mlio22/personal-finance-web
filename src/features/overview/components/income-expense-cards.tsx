import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface IncomeExpenseCardsProps {
  expenses: number;
  income: number;
}

export function IncomeExpenseCards({ expenses, income }: IncomeExpenseCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SummaryCard label="Expenses" amount={expenses} tone="expense" />
      <SummaryCard label="Income" amount={income} tone="income" />
    </div>
  );
}

function SummaryCard({
  label,
  amount,
  tone,
}: {
  label: string;
  amount: number;
  tone: "expense" | "income";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-3",
        tone === "expense" ? "bg-expense/15" : "bg-income/15",
      )}
    >
      <p
        className={cn(
          "text-sm font-medium",
          tone === "expense" ? "text-expense" : "text-income",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-base font-semibold tracking-tight",
          tone === "expense" ? "text-expense" : "text-income",
        )}
      >
        {formatIdr(amount)}
      </p>
    </div>
  );
}
