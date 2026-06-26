import { formatIdr } from "@/lib/format-currency";

interface BudgetFooterProps {
  budgetRemaining: number;
}

export function BudgetFooter({ budgetRemaining }: BudgetFooterProps) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card px-4 py-3">
      <h2 className="text-sm font-semibold text-foreground">Budget</h2>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Expenses</span>
        <span className="text-sm font-semibold text-expense">
          {formatIdr(budgetRemaining)}
        </span>
      </div>
    </section>
  );
}
