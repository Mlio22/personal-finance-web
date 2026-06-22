"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AddTransactionDrawer } from "@/features/transactions/components/add-transaction-drawer";
import { BalanceSummary } from "@/features/transactions/components/balance-summary";
import { TransactionSection } from "@/features/transactions/components/transaction-section";
import { TransactionsSearchDrawer } from "@/features/transactions/components/transactions-search-drawer";
import { TransactionsSkeleton } from "@/features/transactions/components/transactions-skeleton";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { filterTransactionsBySearch } from "@/features/transactions/lib/filter-transactions";
import { useRegisterHeaderAction } from "@/components/layout/header-action-provider";
import { Button } from "@/components/ui/button";

function handleTransactionSelect() {
  // Stub for edit transaction — tracked as follow-up.
}

export function TransactionsScreen() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { data, isLoading } = useTransactions(categoryId);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  useRegisterHeaderAction("transactions", openSearch);

  const filteredData = useMemo(() => {
    if (!data) return undefined;
    return filterTransactionsBySearch(data, searchQuery);
  }, [data, searchQuery]);

  if (isLoading || !filteredData) {
    return <TransactionsSkeleton />;
  }

  const hasTransactions = filteredData.groups.length > 0;

  return (
    <>
      <div className="space-y-4 pb-20">
        <BalanceSummary
          startingBalance={filteredData.startingBalance}
          endingBalance={filteredData.endingBalance}
        />

        {searchQuery ? (
          <p className="px-1 text-xs text-muted-foreground">
            Showing results for &ldquo;{searchQuery}&rdquo;
          </p>
        ) : null}

        {hasTransactions ? (
          <div className="space-y-4">
            {filteredData.groups.map((group) => (
              <TransactionSection
                key={group.date}
                group={group}
                onTransactionSelect={handleTransactionSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground">
              No transactions found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search term or clear the filter."
                : "Transactions for this period will appear here."}
            </p>
          </div>
        )}
      </div>

      <Button
        type="button"
        size="icon-lg"
        className="fixed right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom)+0.75rem)] z-40 size-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-500/90"
        aria-label="Add transaction"
        onClick={() => setAddOpen(true)}
      >
        <Plus className="size-6" aria-hidden="true" />
      </Button>

      <TransactionsSearchDrawer
        open={searchOpen}
        onOpenChange={setSearchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      <AddTransactionDrawer open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
