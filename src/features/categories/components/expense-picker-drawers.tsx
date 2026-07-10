"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  Bell,
  Calendar,
  CircleDollarSign,
  IndianRupee,
  Moon,
  Repeat,
  Star,
  Sun,
  UserRound,
} from "lucide-react";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { CategoryBudgetIcon } from "@/features/categories/components/category-budget-icon";
import type { CategorySummaryItem } from "@/features/categories/types";
import type { Account } from "@/features/accounts/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatMoney } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

const EXPENSE_DRAWER_CLASS =
  "mx-auto max-h-[92dvh] max-w-lg gap-0 overflow-y-auto rounded-t-[1.75rem] border-0 bg-[#1c1c1e] px-0 pb-[env(safe-area-inset-bottom)] [&>div:first-child]:mt-2.5 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[#3a3a3c]";

const CURRENCY_OPTIONS = {
  my: [
    { code: "XAUg", label: "Gold Gram" },
    { code: "IDR", label: "Indonesian rupiah" },
    { code: "USD", label: "United States dollar" },
  ],
  main: [
    { code: "USD", label: "United States dollar" },
    { code: "EUR", label: "Euro" },
    { code: "SGD", label: "Singapore dollar" },
  ],
  other: [
    { code: "JPY", label: "Japanese yen" },
    { code: "GBP", label: "British pound" },
    { code: "AUD", label: "Australian dollar" },
  ],
} as const;

type CurrencyTab = keyof typeof CURRENCY_OPTIONS;

function formatPickerDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return startOfDay(next);
}

interface ExpenseAccountPickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
  selectedAccountId: string;
  onSelect: (accountId: string) => void;
}

export function ExpenseAccountPickerDrawer({
  open,
  onOpenChange,
  accounts,
  selectedAccountId,
  onSelect,
}: ExpenseAccountPickerDrawerProps) {
  const selectedAccount =
    accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];

  if (!selectedAccount) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} nested>
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <DrawerTitle className="sr-only">From account</DrawerTitle>

        <div className="px-4 pb-3 pt-2">
          <div
            className="relative rounded-2xl px-4 pb-4 pt-10 text-white"
            style={{ backgroundColor: selectedAccount.color ?? "#14b8a6" }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#1c1c1e] p-1">
              <AccountAvatar
                name={selectedAccount.name}
                color={selectedAccount.color}
                icon={selectedAccount.icon}
                className="size-12"
              />
            </div>
            {selectedAccount.isDefault ? (
              <Star
                className="absolute right-3 top-3 size-4 fill-white text-white"
                aria-hidden="true"
              />
            ) : null}
            <p className="text-center text-lg font-semibold">{selectedAccount.name}</p>
            <p className="mt-1 text-center text-xs text-white/75">Account balance</p>
            <p className="text-center text-sm font-semibold tabular-nums">
              {formatMoney(selectedAccount.balance, selectedAccount.currency)}
            </p>
          </div>
        </div>

        <div className="space-y-1 px-2 pb-4">
          {accounts.map((account) => {
            const isSelected = account.id === selectedAccountId;

            return (
              <DrawerClose key={account.id} asChild>
                <button
                  type="button"
                  onClick={() => onSelect(account.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-[#2c2c2e]",
                    isSelected && "bg-[#2c2c2e]",
                  )}
                >
                  <AccountAvatar
                    name={account.name}
                    color={account.color}
                    icon={account.icon}
                    className="size-9"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{account.name}</p>
                  </div>
                  <p
                    className="shrink-0 text-sm font-semibold tabular-nums"
                    style={{ color: account.color ?? "#14b8a6" }}
                  >
                    {formatMoney(account.balance, account.currency)}
                  </p>
                </button>
              </DrawerClose>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface ExpenseCategoryPickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategorySummaryItem[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function ExpenseCategoryPickerDrawer({
  open,
  onOpenChange,
  categories,
  selectedCategoryId,
  onSelect,
}: ExpenseCategoryPickerDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} nested>
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <DrawerTitle className="sr-only">Expense category</DrawerTitle>

        <div className="px-4 pb-4 pt-3">
          <div className="flex flex-col items-center gap-2 border-b border-[#7c3aed]/60 pb-3">
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-[#7c3aed] text-[#c4b5fd]">
              <ArrowDown className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-[#c4b5fd]">Expense</p>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {categories.map((category) => {
              const isSelected = category.id === selectedCategoryId;

              return (
                <DrawerClose key={category.id} asChild>
                  <button
                    type="button"
                    onClick={() => onSelect(category.id)}
                    className={cn(
                      "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1 transition-colors",
                      isSelected && "bg-[#2c2c2e] ring-1 ring-[#7c3aed]/70",
                    )}
                  >
                    <span className="line-clamp-1 text-[10px] font-semibold">
                      {category.name}
                    </span>
                    <CategoryBudgetIcon
                      icon={category.icon}
                      color={category.color}
                      budgetedAmount={category.budgetedAmount}
                      spentAmount={category.spentAmount}
                    />
                    <span
                      className="text-[9px] font-semibold tabular-nums"
                      style={{ color: category.color }}
                    >
                      {formatMoney(category.spentAmount, "IDR", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </button>
                </DrawerClose>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface ExpenseDatePickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export function ExpenseDatePickerDrawer({
  open,
  onOpenChange,
  selectedDate,
  onSelect,
}: ExpenseDatePickerDrawerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const today = startOfDay(new Date());
  const yesterday = shiftDays(today, -1);

  function handleSelect(date: Date) {
    onSelect(date);
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} nested>
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <DrawerTitle className="px-4 pt-2 text-base font-semibold text-foreground">
          Date
        </DrawerTitle>

        <div className="space-y-2 px-4 pb-4 pt-2">
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker?.()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#3a3a3c] bg-[#2c2c2e] px-4 py-3 text-sm font-medium"
          >
            <Calendar className="size-4" aria-hidden="true" />
            <span>Select day</span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate.toISOString().slice(0, 10)}
            onChange={(event) => {
              if (!event.target.value) return;
              handleSelect(
                startOfDay(new Date(`${event.target.value}T12:00:00`)),
              );
            }}
            className="sr-only"
            aria-label="Select transaction date"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelect(yesterday)}
              className="rounded-2xl border border-[#3a3a3c] bg-[#2c2c2e] px-3 py-3 text-left"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Moon className="size-4" aria-hidden="true" />
                Yesterday
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatPickerDate(yesterday)}
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleSelect(today)}
              className="rounded-2xl border border-[#3a3a3c] bg-[#2c2c2e] px-3 py-3 text-left"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sun className="size-4" aria-hidden="true" />
                Today
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatPickerDate(today)}
              </p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled
              className="rounded-2xl border border-[#3a3a3c] bg-[#2c2c2e] px-3 py-3 text-left opacity-60"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Repeat className="size-4" aria-hidden="true" />
                Recurrence
              </div>
              <p className="mt-1 text-xs text-muted-foreground">None</p>
            </button>
            <button
              type="button"
              disabled
              className="rounded-2xl border border-[#3a3a3c] bg-[#2c2c2e] px-3 py-3 text-left opacity-60"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bell className="size-4" aria-hidden="true" />
                Reminder
              </div>
              <p className="mt-1 text-xs text-muted-foreground">None</p>
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface ExpenseCurrencyPickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCurrency: string;
  onSelect: (currency: string) => void;
}

const CURRENCY_TABS: Array<{
  id: CurrencyTab;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "my",
    label: "My currencies",
    icon: <UserRound className="size-4" aria-hidden="true" />,
  },
  {
    id: "main",
    label: "Main currencies",
    icon: <CircleDollarSign className="size-4" aria-hidden="true" />,
  },
  {
    id: "other",
    label: "Other currencies",
    icon: <IndianRupee className="size-4" aria-hidden="true" />,
  },
];

export function ExpenseCurrencyPickerDrawer({
  open,
  onOpenChange,
  selectedCurrency,
  onSelect,
}: ExpenseCurrencyPickerDrawerProps) {
  const [activeTab, setActiveTab] = useState<CurrencyTab>("my");
  const options = CURRENCY_OPTIONS[activeTab];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} nested>
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <div className="flex items-center gap-3 px-4 pt-2">
          <DrawerClose asChild>
            <button
              type="button"
              aria-label="Back"
              className="rounded-full p-1 text-foreground hover:bg-[#2c2c2e]"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
          </DrawerClose>
          <DrawerTitle className="text-base font-semibold">Currency</DrawerTitle>
        </div>

        <div className="mt-2 flex border-b border-[#3a3a3c] px-2">
          {CURRENCY_TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium",
                  isActive ? "text-[#c4b5fd]" : "text-muted-foreground",
                )}
              >
                {tab.icon}
                <span className="line-clamp-1">{tab.label}</span>
                {isActive ? (
                  <span className="h-0.5 w-full rounded-full bg-[#7c3aed]" />
                ) : (
                  <span className="h-0.5 w-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-1 px-2 py-3">
          {options.map((option) => {
            const isSelected = option.code === selectedCurrency;

            return (
              <DrawerClose key={option.code} asChild>
                <button
                  type="button"
                  onClick={() => onSelect(option.code)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-[#2c2c2e]",
                    isSelected && "text-[#c4b5fd]",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border-2",
                      isSelected
                        ? "border-[#7c3aed] bg-[#7c3aed]"
                        : "border-[#6b7280]",
                    )}
                  >
                    {isSelected ? (
                      <span className="size-2 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="text-sm text-muted-foreground">{option.code}</span>
                </button>
              </DrawerClose>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
