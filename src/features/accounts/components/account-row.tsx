"use client";

import type { Account } from "@/features/accounts/types";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { getAccountDescription } from "@/features/accounts/lib/account-store";
import { formatMoney } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface AccountRowProps {
  account: Account;
  onSelect?: (account: Account) => void;
  className?: string;
}

export function AccountRow({ account, onSelect, className }: AccountRowProps) {
  const isZero = account.balance === 0;
  const description = getAccountDescription(account);
  const hasDescription = description.length > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(account)}
      className={cn(
        "flex w-full items-start gap-3 px-1 py-2.5 text-left transition-colors hover:bg-muted/40",
        className,
      )}
    >
      <AccountAvatar
        name={account.name}
        color={account.color}
        icon={account.icon}
        showStar={account.isDefault}
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {account.name}
        </p>
        {hasDescription ? (
          <p className="mt-px break-words text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
        <p
          className={cn(
            "text-sm leading-snug tabular-nums",
            hasDescription ? "mt-px" : "mt-0.5",
            isZero ? "text-muted-foreground" : "text-positive",
          )}
        >
          {formatMoney(account.balance, account.currency, {
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </button>
  );
}
