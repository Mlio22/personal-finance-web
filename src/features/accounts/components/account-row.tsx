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

  return (
    <button
      type="button"
      onClick={() => onSelect?.(account)}
      className={cn(
        "w-full px-1 py-2.5 text-left transition-colors hover:bg-muted/40",
        className,
      )}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3">
        <AccountAvatar
          name={account.name}
          color={account.color}
          icon={account.icon}
          showStar={account.isDefault}
        />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{account.name}</p>
          <p
            className={cn(
              "mt-0.5 text-sm tabular-nums",
              isZero ? "text-muted-foreground" : "text-positive",
            )}
          >
            {formatMoney(account.balance, account.currency, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {description ? (
        <p className="mt-1.5 w-full break-words text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </button>
  );
}
