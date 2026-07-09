"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  FileText,
  Pencil,
  RefreshCw,
  Star,
} from "lucide-react";
import type { Account } from "@/features/accounts/types";
import {
  ACCOUNT_ICON_MAP,
  AccountAvatar,
} from "@/features/accounts/components/account-avatar";
import { ProgressRing } from "@/features/accounts/components/progress-ring";
import {
  getSavingsProgress,
  getSavingsRemaining,
} from "@/features/accounts/data/mock-accounts";
import { formatMoney } from "@/lib/format-currency";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface AccountDetailDrawerProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (account: Account) => void;
  onToggleDefault?: (account: Account) => void;
}

interface AccountAction {
  id: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  bgClassName: string;
}

const REGULAR_ACTIONS: AccountAction[] = [
  {
    id: "edit",
    label: "Edit",
    icon: Pencil,
    iconClassName: "text-[#1e1b4b]",
    bgClassName: "bg-[#facc15]",
  },
  {
    id: "balance",
    label: "Balance",
    icon: RefreshCw,
    iconClassName: "text-foreground",
    bgClassName: "bg-[#3a3a3c]",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: FileText,
    iconClassName: "text-white",
    bgClassName: "bg-[#3b82f6]",
  },
  {
    id: "recharge",
    label: "Recharge",
    icon: ArrowUpFromLine,
    iconClassName: "text-white",
    bgClassName: "bg-[#14b8a6]",
  },
  {
    id: "withdraw",
    label: "Withdraw",
    icon: ArrowDownToLine,
    iconClassName: "text-white",
    bgClassName: "bg-[#e11d48]",
  },
  {
    id: "transfer",
    label: "Transfer",
    icon: ArrowRight,
    iconClassName: "text-foreground",
    bgClassName: "bg-[#3a3a3c]",
  },
];

const SAVINGS_ACTIONS: AccountAction[] = [
  {
    id: "edit",
    label: "Edit",
    icon: Pencil,
    iconClassName: "text-[#1e1b4b]",
    bgClassName: "bg-[#facc15]",
  },
  {
    id: "balance",
    label: "Balance",
    icon: RefreshCw,
    iconClassName: "text-foreground",
    bgClassName: "bg-[#3a3a3c]",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: FileText,
    iconClassName: "text-foreground",
    bgClassName: "bg-[#3a3a3c]",
  },
  {
    id: "recharge",
    label: "Recharge",
    icon: ArrowUpFromLine,
    iconClassName: "text-white",
    bgClassName: "bg-[#14b8a6]",
  },
  {
    id: "withdraw",
    label: "Withdraw",
    icon: ArrowDownToLine,
    iconClassName: "text-white",
    bgClassName: "bg-[#e11d48]",
  },
];

function isSavingsDetail(account: Account): boolean {
  return (
    account.type === "savings" ||
    Boolean(account.isSavingsGoal && account.savingsTarget)
  );
}

export function AccountDetailDrawer({
  account,
  open,
  onOpenChange,
  onEdit,
  onToggleDefault,
}: AccountDetailDrawerProps) {
  if (!account) {
    return null;
  }

  const savings = isSavingsDetail(account);

  function handleAction(actionId: string) {
    if (!account) return;

    if (actionId === "edit") {
      onOpenChange(false);
      onEdit(account);
      return;
    }

    // Remaining actions are stubs until their flows are implemented.
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-lg gap-0 overflow-hidden rounded-t-[1.75rem] border-0 bg-[#1c1c1e] p-0 pb-[max(1rem,env(safe-area-inset-bottom))] [&>div:first-child]:hidden">
        <DrawerTitle className="sr-only">{account.name}</DrawerTitle>

        {savings ? (
          <SavingsDetailHeader account={account} />
        ) : (
          <RegularDetailHeader
            account={account}
            onToggleDefault={onToggleDefault}
          />
        )}

        <div className="px-4 pb-2 pt-5">
          {savings ? (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-x-2">
                {SAVINGS_ACTIONS.slice(0, 3).map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    onClick={() => handleAction(action.id)}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 justify-items-center gap-x-2 px-10">
                {SAVINGS_ACTIONS.slice(3).map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    onClick={() => handleAction(action.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-x-2 gap-y-5">
              {REGULAR_ACTIONS.map((action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onClick={() => handleAction(action.id)}
                />
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RegularDetailHeader({
  account,
  onToggleDefault,
}: {
  account: Account;
  onToggleDefault?: (account: Account) => void;
}) {
  const Icon = account.icon ? ACCOUNT_ICON_MAP[account.icon] : ACCOUNT_ICON_MAP.card;

  return (
    <div
      className="rounded-t-[1.75rem] px-5 pb-5 pt-6 text-white"
      style={{ backgroundColor: account.color ?? "#3B82F6" }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white"
          aria-hidden="true"
        >
          {account.icon === "sos" ? (
            <span className="text-[0.65rem] font-bold tracking-wide">SOS</span>
          ) : (
            <Icon className="size-5" strokeWidth={1.75} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[1.125rem] font-semibold leading-tight">
              {account.name}
            </p>
            <button
              type="button"
              aria-label={
                account.isDefault ? "Unset default account" : "Set as default"
              }
              aria-pressed={Boolean(account.isDefault)}
              onClick={() => onToggleDefault?.(account)}
              className="shrink-0 rounded-full p-1 transition-opacity hover:opacity-80"
            >
              <Star
                className={cn(
                  "size-5",
                  account.isDefault
                    ? "fill-white text-white"
                    : "fill-transparent text-white",
                )}
                strokeWidth={1.75}
              />
            </button>
          </div>

          <p className="mt-4 text-[0.8125rem] font-medium text-white/80">
            Account balance
          </p>
          <p className="mt-1 text-[1.5rem] font-semibold tabular-nums tracking-tight">
            {formatMoney(account.balance, account.currency, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function SavingsDetailHeader({ account }: { account: Account }) {
  const progress = getSavingsProgress(account);
  const remaining = getSavingsRemaining(account);

  return (
    <div className="rounded-t-[1.75rem] bg-[#1c1c1e] px-5 pb-2 pt-6">
      <div className="flex items-start gap-3">
        <AccountAvatar
          name={account.name}
          color={account.color}
          icon={account.icon}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <p className="text-[1.0625rem] font-semibold leading-tight text-foreground">
            {account.name}
          </p>
        </div>

        <ProgressRing progress={progress} size={48} strokeWidth={3.5} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[0.8125rem] font-medium text-muted-foreground">
            Savings
          </p>
          <p className="mt-1 text-[1.0625rem] font-semibold tabular-nums text-positive">
            {formatMoney(account.balance, account.currency, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.8125rem] font-medium text-muted-foreground">
            Remaining
          </p>
          <p className="mt-1 text-[1.0625rem] font-semibold tabular-nums text-foreground">
            {formatMoney(remaining, account.currency, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  action,
  onClick,
}: {
  action: AccountAction;
  onClick: () => void;
}) {
  const Icon = action.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 py-1 transition-opacity hover:opacity-90"
    >
      <span
        className={cn(
          "flex size-14 items-center justify-center rounded-full",
          action.bgClassName,
        )}
        aria-hidden="true"
      >
        <Icon className={cn("size-6", action.iconClassName)} strokeWidth={1.75} />
      </span>
      <span className="text-[0.8125rem] font-medium text-foreground">
        {action.label}
      </span>
    </button>
  );
}
