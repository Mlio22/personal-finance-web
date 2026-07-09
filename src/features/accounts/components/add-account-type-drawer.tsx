"use client";

import {
  CircleDollarSign,
  HandCoins,
  PiggyBank,
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
    icon: CircleDollarSign,
    iconClassName: "text-amber-700",
    iconBgClassName: "bg-amber-100",
  },
  {
    type: "debt",
    title: "Debt",
    subtitle: "Credit, mortgage, ...",
    icon: HandCoins,
    iconClassName: "text-emerald-700",
    iconBgClassName: "bg-emerald-100",
  },
  {
    type: "savings",
    title: "Savings",
    subtitle: "Savings, goal, ...",
    icon: PiggyBank,
    iconClassName: "text-yellow-700",
    iconBgClassName: "bg-yellow-100",
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
      <DrawerContent className="rounded-t-3xl border-border/60 bg-popover px-2 pb-6">
        <DrawerHeader className="px-4 pb-2 pt-1">
          <DrawerTitle className="text-center text-base font-semibold">
            New account
          </DrawerTitle>
        </DrawerHeader>

        <div className="divide-y divide-border/50">
          {ACCOUNT_TYPE_OPTIONS.map((option) => {
            const Icon = option.icon;

            return (
              <button
                key={option.type}
                type="button"
                onClick={() => onSelectType(option.type)}
                className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/50 active:bg-muted/70"
              >
                <span
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                    option.iconBgClassName,
                  )}
                  aria-hidden="true"
                >
                  <Icon
                    className={cn("size-7", option.iconClassName)}
                    strokeWidth={1.75}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold text-foreground">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
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
