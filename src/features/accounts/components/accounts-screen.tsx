"use client";

import { useState } from "react";
import type { AccountsSubTab } from "@/features/accounts/types";
import { AccountSection } from "@/features/accounts/components/account-section";
import { AccountsSubNav } from "@/features/accounts/components/accounts-sub-nav";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";

function AccountsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between px-3">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl px-3 py-3"
          >
            <div className="size-9 animate-pulse rounded-full bg-muted" />
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ComingSoonPanel({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
    </div>
  );
}

function handleAccountSelect() {
  // Stub for account detail/edit — tracked as follow-up.
}

export function AccountsScreen() {
  const [activeSubTab, setActiveSubTab] = useState<AccountsSubTab>("accounts");
  const { data, isLoading, isUsingFallback } = useAccounts();

  return (
    <div>
      <AccountsSubNav activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {activeSubTab === "debts" ? (
        <ComingSoonPanel title="Debts" />
      ) : activeSubTab === "my-finances" ? (
        <ComingSoonPanel title="My finances" />
      ) : isLoading && !data ? (
        <AccountsLoadingSkeleton />
      ) : data ? (
        <div className="space-y-6">
          {isUsingFallback ? (
            <p className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs text-muted-foreground">
              Showing cached account data. Connect the API to load live balances.
            </p>
          ) : null}

          <AccountSection
            title="Accounts"
            subtotal={data.totals.accounts}
            accounts={data.accounts}
            variant="regular"
            onAccountSelect={handleAccountSelect}
          />

          <AccountSection
            title="Savings"
            subtotal={data.totals.savings}
            accounts={data.savings}
            variant="savings"
            onAccountSelect={handleAccountSelect}
            subtotalDecimals={2}
          />
        </div>
      ) : (
        <ComingSoonPanel title="Accounts unavailable" />
      )}
    </div>
  );
}
