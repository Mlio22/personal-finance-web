import { formatIdr } from "@/lib/format-currency";

interface BalanceSummaryProps {
  startingBalance: number;
  endingBalance: number;
}

export function BalanceSummary({
  startingBalance,
  endingBalance,
}: BalanceSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
      <div>
        <p className="text-label text-[0.65rem] text-muted-foreground">
          Starting balance
        </p>
        <p className="mt-1 text-sm font-semibold text-positive">
          {formatIdr(startingBalance)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-label text-[0.65rem] text-muted-foreground">
          Ending balance
        </p>
        <p className="mt-1 text-sm font-semibold text-positive">
          {formatIdr(endingBalance)}
        </p>
      </div>
    </div>
  );
}
