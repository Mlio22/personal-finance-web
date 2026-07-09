"use client";

import type { Account } from "@/features/accounts/types";
import { getSavingsProgress } from "@/features/accounts/data/mock-accounts";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { ProgressRing } from "@/features/accounts/components/progress-ring";
import { getAccountDescription } from "@/features/accounts/lib/account-store";
import { formatMoney } from "@/lib/format-currency";
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
  const isZero = account.balance === 0;
  const hasGoal = Boolean(account.isSavingsGoal && account.savingsTarget);
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
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {account.name}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <p
            className={cn(
              "min-w-0 flex-1 text-sm leading-snug tabular-nums",
              isZero ? "text-muted-foreground" : "text-positive",
            )}
          >
            {formatMoney(account.balance, account.currency, {
              maximumFractionDigits: 2,
            })}
          </p>

          {hasGoal ? (
            <div className="flex shrink-0 items-center gap-2.5">
              <p className="text-sm font-medium leading-snug tabular-nums text-foreground">
                {formatMoney(account.savingsTarget ?? 0, account.currency, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <ProgressRing progress={progress} />
            </div>
          ) : null}
        </div>

        {hasDescription ? (
          <p className="mt-px break-words text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </button>
  );
}
