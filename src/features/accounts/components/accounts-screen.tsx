"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import type {
  Account,
  AccountsSubTab,
  NewAccountTypeOption,
} from "@/features/accounts/types";
import { AccountSection } from "@/features/accounts/components/account-section";
import { AccountRow } from "@/features/accounts/components/account-row";
import { AccountsSubNav } from "@/features/accounts/components/accounts-sub-nav";
import { AddAccountTypeDrawer } from "@/features/accounts/components/add-account-type-drawer";
import { AccountDetailDrawer } from "@/features/accounts/components/account-detail-drawer";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import {
  findAccountById,
  setDefaultAccountInMockCache,
} from "@/features/accounts/lib/account-store";
import { useRegisterHeaderAction } from "@/components/layout/header-action-provider";
import { cn } from "@/lib/utils";

function AccountsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between px-1">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-1 py-2.5"
          >
            <div className="size-10 animate-pulse rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComingSoonPanel({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
    </div>
  );
}

function ArchiveSection({
  accounts,
  onAccountSelect,
}: {
  accounts: Account[];
  onAccountSelect?: (account: Account) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between rounded-lg bg-muted/60 px-3 py-3 text-left transition-colors hover:bg-muted"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-muted-foreground">Archive</span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="mt-1">
          {accounts.length === 0 ? (
            <p className="px-1 py-3 text-sm text-muted-foreground">
              No archived accounts
            </p>
          ) : (
            accounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                onSelect={onAccountSelect}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export function AccountsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<AccountsSubTab>("accounts");
  const [addTypeOpen, setAddTypeOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { data, isLoading, isUsingFallback } = useAccounts();

  const openAddAccount = useCallback(() => setAddTypeOpen(true), []);
  useRegisterHeaderAction("accounts", openAddAccount);

  const syncAccountsQuery = useCallback(
    (next: ReturnType<typeof setDefaultAccountInMockCache>) => {
      queryClient.setQueryData(["accounts"], {
        data: next,
        isUsingFallback: true,
      });
    },
    [queryClient],
  );

  const handleAccountSelect = useCallback((account: Account) => {
    setSelectedAccount(account);
    setDetailOpen(true);
  }, []);

  const handleEditAccount = useCallback(
    (account: Account) => {
      router.push(`/accounts/${account.id}/edit`);
    },
    [router],
  );

  const handleToggleDefault = useCallback(
    (account: Account) => {
      const next = setDefaultAccountInMockCache(account.id);
      syncAccountsQuery(next);
      const updated = findAccountById(next, account.id) ?? null;
      setSelectedAccount(updated);
    },
    [syncAccountsQuery],
  );

  const handleSelectType = useCallback(
    (type: NewAccountTypeOption) => {
      setAddTypeOpen(false);
      router.push(`/accounts/new?type=${type}`);
    },
    [router],
  );

  const handleDetailOpenChange = useCallback((open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      setSelectedAccount(null);
    }
  }, []);

  return (
    <>
      <div>
        <AccountsSubNav activeTab={activeSubTab} onTabChange={setActiveSubTab} />

        {activeSubTab === "debts" ? (
          <ComingSoonPanel title="Debts" />
        ) : activeSubTab === "my-finances" ? (
          <ComingSoonPanel title="My finances" />
        ) : isLoading && !data ? (
          <AccountsLoadingSkeleton />
        ) : data ? (
          <div className="space-y-5">
            {isUsingFallback ? (
              <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
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

            <ArchiveSection
              accounts={data.archived}
              onAccountSelect={handleAccountSelect}
            />
          </div>
        ) : (
          <ComingSoonPanel title="Accounts unavailable" />
        )}
      </div>

      <AddAccountTypeDrawer
        open={addTypeOpen}
        onOpenChange={setAddTypeOpen}
        onSelectType={handleSelectType}
      />

      <AccountDetailDrawer
        account={selectedAccount}
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        onEdit={handleEditAccount}
        onToggleDefault={handleToggleDefault}
      />
    </>
  );
}
