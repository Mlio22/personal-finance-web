"use client";

import type { Account } from "@/features/accounts/types";
import {
  getSavingsProgress,
  getSavingsRemaining,
} from "@/features/accounts/data/mock-accounts";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { ProgressRing } from "@/features/accounts/components/progress-ring";
import { getAccountDescription } from "@/features/accounts/lib/account-store";
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
      <div
        className={cn(
          "grid items-start gap-x-3 gap-y-1",
          hasGoal
            ? "grid-cols-[auto_minmax(0,1fr)_auto]"
            : "grid-cols-[auto_minmax(0,1fr)]",
        )}
      >
        <AccountAvatar
          name={account.name}
          color={account.color}
          icon={account.icon}
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

        {hasGoal ? (
          <div className="flex shrink-0 items-center gap-2.5 self-center">
            <span className="text-sm font-medium tabular-nums text-foreground">
              {formatIdr(
                remaining > 0 ? remaining : (account.savingsTarget ?? 0),
              )}
            </span>
            <ProgressRing progress={progress} />
          </div>
        ) : null}

        {description ? (
          <p
            className={cn(
              "w-full break-words text-xs leading-relaxed text-muted-foreground",
              hasGoal ? "col-span-3" : "col-span-2",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </button>
  );
}
