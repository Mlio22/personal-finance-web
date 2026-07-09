"use client";

import type { Account } from "@/features/accounts/types";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { formatMoney } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface AccountRowProps {
  account: Account;
  onSelect?: (account: Account) => void;
  className?: string;
}

export function AccountRow({ account, onSelect, className }: AccountRowProps) {
  const isZero = account.balance === 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(account)}
      className={cn(
        "flex w-full items-center gap-3 px-1 py-2.5 text-left transition-colors hover:bg-muted/40",
        className,
      )}
    >
      <AccountAvatar
        name={account.name}
        color={account.color}
        icon={account.icon}
        showStar={account.isDefault}
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          {account.name}
        </span>
        <span
          className={cn(
            "mt-0.5 block text-sm tabular-nums",
            isZero ? "text-muted-foreground" : "text-positive",
          )}
        >
          {formatMoney(account.balance, account.currency, {
            maximumFractionDigits: 2,
          })}
        </span>
      </span>
    </button>
  );
}
