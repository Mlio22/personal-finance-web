"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  ALL_ACCOUNTS_FILTER_ID,
  getTotalBalance,
} from "@/features/accounts/data/mock-accounts";
import { useAccountFilter } from "@/features/accounts/context/account-filter-provider";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function AccountFilterSheet() {
  const {
    accounts,
    selectedAccountId,
    displayLabel,
    displayBalance,
    setSelectedAccountId,
  } = useAccountFilter();

  const totalBalance = getTotalBalance(accounts);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto min-w-0 flex-1 flex-col items-center gap-0.5 px-2 py-1 hover:bg-transparent"
        >
          <span className="flex items-center gap-1 text-sm font-medium text-foreground">
            {displayLabel}
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <span className="text-xs text-positive">{formatIdr(displayBalance)}</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle>Select account</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-1">
          <AccountFilterOption
            name="All accounts"
            balance={totalBalance}
            selected={selectedAccountId === ALL_ACCOUNTS_FILTER_ID}
            onSelect={() => setSelectedAccountId(ALL_ACCOUNTS_FILTER_ID)}
          />

          {accounts.map((account) => (
            <AccountFilterOption
              key={account.id}
              name={account.name}
              balance={account.balance}
              color={account.color}
              selected={selectedAccountId === account.id}
              onSelect={() => setSelectedAccountId(account.id)}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function AccountFilterOption({
  name,
  balance,
  color,
  selected,
  onSelect,
}: {
  name: string;
  balance: number;
  color?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <DrawerClose asChild>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/60",
          selected && "bg-muted",
        )}
      >
      {color ? (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
      ) : (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground"
          aria-hidden="true"
        >
          A
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{name}</span>
        <span className="block text-xs text-positive">{formatIdr(balance)}</span>
      </span>

      {selected ? (
        <Check className="size-4 shrink-0 text-positive" aria-hidden="true" />
      ) : null}
      </button>
    </DrawerClose>
  );
}
