"use client";

import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { usePeriod } from "@/features/period/context/period-provider";
import { formatIdr } from "@/lib/format-currency";

interface TabPlaceholderProps {
  title: string;
  description: string;
  showPeriod?: boolean;
}

export function TabPlaceholder({
  title,
  description,
  showPeriod = true,
}: TabPlaceholderProps) {
  const { displayLabel, displayBalance } = useAccountFilter();
  const { displayLabel: periodLabel, preset } = usePeriod();

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-4">
        <p className="text-label text-muted-foreground">Account filter</p>
        <p className="mt-1 text-lg font-medium">{displayLabel}</p>
        <p className="mt-1 text-amount text-positive">{formatIdr(displayBalance)}</p>
        {showPeriod ? (
          <>
            <p className="mt-4 text-label text-muted-foreground">Selected period</p>
            <p className="mt-1 text-lg font-medium">{periodLabel}</p>
            <p className="mt-1 text-xs text-muted-foreground capitalize">{preset}</p>
          </>
        ) : null}
        <p className="mt-3 text-xs text-muted-foreground">
          This placeholder screen confirms the shared shell, header filter, and tab
          routing are wired up. Full page content will be implemented in a follow-up
          issue.
        </p>
      </section>
    </div>
  );
}
