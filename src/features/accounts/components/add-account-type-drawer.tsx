"use client";

import {
  ChartLine,
  HandCoins,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { NewAccountTypeOption } from "@/features/accounts/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface AccountTypeOption {
  type: NewAccountTypeOption;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBgClassName: string;
}

const ACCOUNT_TYPE_OPTIONS: AccountTypeOption[] = [
  {
    type: "regular",
    title: "Regular",
    subtitle: "Cash, card, ...",
    icon: Wallet,
    iconClassName: "text-amber-800",
    iconBgClassName: "bg-gradient-to-br from-amber-100 to-amber-200",
  },
  {
    type: "debt",
    title: "Debt",
    subtitle: "Credit, mortgage, ...",
    icon: HandCoins,
    iconClassName: "text-emerald-800",
    iconBgClassName: "bg-gradient-to-br from-emerald-100 to-emerald-200",
  },
  {
    type: "savings",
    title: "Savings",
    subtitle: "Savings, goal, ...",
    icon: PiggyBank,
    iconClassName: "text-yellow-800",
    iconBgClassName: "bg-gradient-to-br from-yellow-100 to-amber-200",
  },
  {
    type: "investment",
    title: "Investment",
    subtitle: "Stocks, funds, ...",
    icon: ChartLine,
    iconClassName: "text-emerald-800",
    iconBgClassName: "bg-gradient-to-br from-emerald-100 to-teal-200",
  },
];

interface AddAccountTypeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: NewAccountTypeOption) => void;
}

export function AddAccountTypeDrawer({
  open,
  onOpenChange,
  onSelectType,
}: AddAccountTypeDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-lg rounded-t-[1.75rem] border-0 bg-[#1c1c1e] px-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] [&>div:first-child]:mt-3 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[#3a3a3c]">
        <DrawerHeader className="space-y-0 px-5 pb-5 pt-4">
          <DrawerTitle className="text-center text-[1.125rem] font-semibold tracking-tight text-white">
            New account
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-3 px-4 pb-2">
          {ACCOUNT_TYPE_OPTIONS.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.type}
                type="button"
                onClick={() => onSelectType(option.type)}
                className="flex w-full items-center gap-4 rounded-2xl bg-[#2c2c2e] px-4 py-4 text-left transition-colors hover:bg-[#3a3a3c] active:bg-[#3a3a3c]"
              >
                <span
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                    option.iconBgClassName,
                  )}
                  aria-hidden="true"
                >
                  <Icon
                    className={cn("size-8", option.iconClassName)}
                    strokeWidth={1.6}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[1.0625rem] font-semibold leading-tight text-white">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] leading-snug text-[#8e8e93]">
                    {option.subtitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
