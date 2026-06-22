"use client";

import type { Account } from "@/features/accounts/types";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface AccountRowProps {
  account: Account;
  onSelect?: (account: Account) => void;
  className?: string;
}

export function AccountRow({ account, onSelect, className }: AccountRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(account)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/60",
        className,
      )}
    >
      <AccountAvatar
        name={account.name}
        color={account.color}
        showStar={account.isDefault}
      />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{account.name}</span>
      </span>

      <span className="shrink-0 text-sm font-semibold text-positive">
        {formatIdr(account.balance)}
      </span>
    </button>
  );
}
