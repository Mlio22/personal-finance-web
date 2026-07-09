"use client";

import type { Account } from "@/features/accounts/types";
import {
  getSavingsProgress,
  getSavingsRemaining,
} from "@/features/accounts/data/mock-accounts";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { ProgressRing } from "@/features/accounts/components/progress-ring";
import { formatIdr, formatMoney } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface SavingsAccountRowProps {
  account: Account;
  onSelect?: (account: Account) => void;
  className?: string;
}

export function SavingsAccountRow({
  account,
  onSelect,
  className,
}: SavingsAccountRowProps) {
  const progress = getSavingsProgress(account);
  const remaining = getSavingsRemaining(account);
  const isZero = account.balance === 0;
  const hasGoal = Boolean(account.isSavingsGoal && account.savingsTarget);

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
        {account.goalLabel ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {account.goalLabel}
          </span>
        ) : null}
      </span>

      {hasGoal ? (
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="text-sm font-medium tabular-nums text-foreground">
            {formatIdr(remaining > 0 ? remaining : (account.savingsTarget ?? 0))}
          </span>
          <ProgressRing progress={progress} />
        </div>
      ) : null}
    </button>
  );
}
