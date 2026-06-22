"use client";

import type { Account } from "@/features/accounts/types";
import {
  getSavingsProgress,
  getSavingsRemaining,
} from "@/features/accounts/data/mock-accounts";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { ProgressRing } from "@/features/accounts/components/progress-ring";
import { formatIdr } from "@/lib/format-currency";
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

  return (
    <button
      type="button"
      onClick={() => onSelect?.(account)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/60",
        className,
      )}
    >
      <AccountAvatar name={account.name} color={account.color} />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{account.name}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {formatIdr(remaining)} remaining
        </span>
      </span>

      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-semibold text-positive">
          {formatIdr(account.balance)}
        </span>
        {account.isSavingsGoal && account.savingsTarget ? (
          <ProgressRing progress={progress} />
        ) : null}
      </div>
    </button>
  );
}
