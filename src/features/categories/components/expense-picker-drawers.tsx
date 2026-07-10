"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
import {
  getRecurrenceLabel,
  getReminderLabel,
  RECURRENCE_OPTIONS,
  REMINDER_OPTIONS,
  type RecurrenceValue,
  type ReminderValue,
} from "@/features/categories/lib/transaction-schedule-options";
import type { Account } from "@/features/accounts/types";
import {
  NestedDrawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatMoney } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

const EXPENSE_DRAWER_CLASS =
  "mx-auto max-h-[85dvh] max-w-lg gap-0 overflow-y-auto rounded-t-[1.75rem] border-0 bg-[#2c2c2e] px-0 pb-[env(safe-area-inset-bottom)] [&>div:first-child]:mt-2.5 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[#3a3a3c]";

const PICKER_CARD_CLASS =
  "rounded-2xl border border-[#3a3a3c] bg-[#3a3a3c] px-3 py-3 text-left transition-colors";

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

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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

  function handleSelect(accountId: string) {
    onSelect(accountId);
    onOpenChange(false);
  }

  return (
    <NestedDrawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <DrawerTitle className="sr-only">From account</DrawerTitle>

        <div className="px-4 pb-3 pt-2">
          <div
            className="relative rounded-2xl px-4 pb-4 pt-10 text-white"
            style={{ backgroundColor: selectedAccount.color ?? "#14b8a6" }}
          >
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#2c2c2e] p-1">
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
            <p className="text-center text-lg font-semibold">
              {selectedAccount.name}
            </p>
            <p className="mt-1 text-center text-xs text-white/75">
              Account balance
            </p>
            <p className="text-center text-sm font-semibold tabular-nums">
              {formatMoney(selectedAccount.balance, selectedAccount.currency)}
            </p>
          </div>
        </div>

        <div className="space-y-1 px-2 pb-4">
          {accounts.map((account) => {
            const isSelected = account.id === selectedAccountId;

            return (
              <button
                key={account.id}
                type="button"
                onClick={() => handleSelect(account.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-[#3a3a3c]",
                  isSelected && "bg-[#3a3a3c]",
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
            );
          })}
        </div>
      </DrawerContent>
    </NestedDrawer>
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
  function handleSelect(categoryId: string) {
    onSelect(categoryId);
    onOpenChange(false);
  }

  return (
    <NestedDrawer open={open} onOpenChange={onOpenChange}>
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
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelect(category.id)}
                  className={cn(
                    "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1 transition-colors",
                    isSelected && "bg-[#3a3a3c] ring-1 ring-[#7c3aed]/70",
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
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </NestedDrawer>
  );
}

interface ExpenseDatePickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  selectedRecurrence: RecurrenceValue;
  onRecurrenceChange: (value: RecurrenceValue) => void;
  selectedReminder: ReminderValue;
  onReminderChange: (value: ReminderValue) => void;
}

interface ExpenseScheduleRadioDrawerProps<T extends string> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  icon: ReactNode;
  options: readonly { value: T; label: string }[];
  selected: T;
  onConfirm: (value: T) => void;
}

function ExpenseScheduleRadioDrawer<T extends string>({
  open,
  onOpenChange,
  title,
  icon,
  options,
  selected,
  onConfirm,
}: ExpenseScheduleRadioDrawerProps<T>) {
  const [draftValue, setDraftValue] = useState(selected);

  useEffect(() => {
    if (open) {
      setDraftValue(selected);
    }
  }, [open, selected]);

  return (
    <NestedDrawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <div className="flex items-center gap-2 px-4 pt-2">
          {icon}
          <DrawerTitle className="text-base font-semibold text-foreground">
            {title}
          </DrawerTitle>
        </div>

        <div className="max-h-[55dvh] space-y-0.5 overflow-y-auto px-2 py-2">
          {options.map((option) => {
            const isSelected = option.value === draftValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDraftValue(option.value)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-[#3a3a3c]"
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    isSelected
                      ? "border-white bg-white"
                      : "border-[#6b7280] bg-transparent",
                  )}
                >
                  {isSelected ? (
                    <span className="size-2.5 rounded-full bg-[#2c2c2e]" />
                  ) : null}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end px-4 pb-5 pt-2">
          <button
            type="button"
            onClick={() => {
              onConfirm(draftValue);
              onOpenChange(false);
            }}
            className="rounded-full bg-[#4a4a4c] px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-[#56565a]"
          >
            OK
          </button>
        </div>
      </DrawerContent>
    </NestedDrawer>
  );
}

export function ExpenseDatePickerDrawer({
  open,
  onOpenChange,
  selectedDate,
  onSelect,
  selectedRecurrence,
  onRecurrenceChange,
  selectedReminder,
  onReminderChange,
}: ExpenseDatePickerDrawerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [recurrencePickerOpen, setRecurrencePickerOpen] = useState(false);
  const [reminderPickerOpen, setReminderPickerOpen] = useState(false);
  const today = startOfDay(new Date());
  const yesterday = shiftDays(today, -1);
  const isTodaySelected = isSameDay(selectedDate, today);
  const isYesterdaySelected = isSameDay(selectedDate, yesterday);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && (recurrencePickerOpen || reminderPickerOpen)) {
      return;
    }

    onOpenChange(nextOpen);
  }

  function handleSelect(date: Date) {
    onSelect(date);
    onOpenChange(false);
  }

  return (
    <NestedDrawer
      open={open}
      onOpenChange={handleOpenChange}
      dismissible={!recurrencePickerOpen && !reminderPickerOpen}
    >
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <DrawerTitle className="px-4 pt-1 text-center text-base font-semibold text-foreground">
          Date
        </DrawerTitle>

        <div className="space-y-2 px-4 pb-5 pt-3">
          <button
            type="button"
            onClick={() => {
              const input = dateInputRef.current;
              if (!input) return;
              if (typeof input.showPicker === "function") {
                input.showPicker();
              } else {
                input.click();
              }
            }}
            className={cn(
              PICKER_CARD_CLASS,
              "flex w-full items-center justify-center gap-2 py-4 text-sm font-medium",
            )}
          >
            <Calendar className="size-5" aria-hidden="true" />
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
              className={cn(
                PICKER_CARD_CLASS,
                isYesterdaySelected && "bg-[#4a4a4c] ring-1 ring-white/20",
              )}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Moon className="size-4 shrink-0" aria-hidden="true" />
                Yesterday
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                {formatPickerDate(yesterday)}
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleSelect(today)}
              className={cn(
                PICKER_CARD_CLASS,
                isTodaySelected && "bg-[#4a4a4c] ring-1 ring-white/20",
              )}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sun className="size-4 shrink-0" aria-hidden="true" />
                Today
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                {formatPickerDate(today)}
              </p>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRecurrencePickerOpen(true)}
              className={PICKER_CARD_CLASS}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Repeat className="size-4 shrink-0" aria-hidden="true" />
                Recurrence
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                {getRecurrenceLabel(selectedRecurrence)}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setReminderPickerOpen(true)}
              className={PICKER_CARD_CLASS}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bell className="size-4 shrink-0" aria-hidden="true" />
                Reminder
              </div>
              <p className="mt-1 pl-6 text-xs text-muted-foreground">
                {getReminderLabel(selectedReminder)}
              </p>
            </button>
          </div>
        </div>

        <ExpenseScheduleRadioDrawer
          open={recurrencePickerOpen}
          onOpenChange={setRecurrencePickerOpen}
          title="Recurrence"
          icon={<Repeat className="size-5" aria-hidden="true" />}
          options={RECURRENCE_OPTIONS}
          selected={selectedRecurrence}
          onConfirm={onRecurrenceChange}
        />

        <ExpenseScheduleRadioDrawer
          open={reminderPickerOpen}
          onOpenChange={setReminderPickerOpen}
          title="Reminder"
          icon={<Bell className="size-5" aria-hidden="true" />}
          options={REMINDER_OPTIONS}
          selected={selectedReminder}
          onConfirm={onReminderChange}
        />
      </DrawerContent>
    </NestedDrawer>
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

  function handleSelect(currency: string) {
    onSelect(currency);
    onOpenChange(false);
  }

  return (
    <NestedDrawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={EXPENSE_DRAWER_CLASS}>
        <div className="relative flex items-center justify-center px-4 pt-1">
          <button
            type="button"
            aria-label="Back"
            onClick={() => onOpenChange(false)}
            className="absolute left-3 rounded-full p-1.5 text-foreground hover:bg-[#3a3a3c]"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <DrawerTitle className="text-center text-base font-semibold">
            Currency
          </DrawerTitle>
        </div>

        <div className="mt-3 flex border-b border-[#3a3a3c] px-1">
          {CURRENCY_TABS.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex min-w-0 flex-1 flex-col items-center gap-1.5 px-1 pb-2.5 pt-1 text-[10px] font-medium",
                  isActive ? "text-[#c4b5fd]" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border",
                    isActive
                      ? "border-[#7c3aed]/70 text-[#c4b5fd]"
                      : "border-[#4a4a4c]",
                  )}
                >
                  {tab.icon}
                </span>
                <span className="line-clamp-1">{tab.label}</span>
                {isActive ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#7c3aed]" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="space-y-0.5 px-2 py-2">
          {options.map((option) => {
            const isSelected = option.code === selectedCurrency;

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleSelect(option.code)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-[#3a3a3c]"
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    isSelected
                      ? "border-[#7c3aed] bg-[#7c3aed]"
                      : "border-[#6b7280]",
                  )}
                >
                  {isSelected ? (
                    <span className="size-2 rounded-full bg-white" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 text-sm font-medium",
                    isSelected ? "text-[#c4b5fd]" : "text-foreground",
                  )}
                >
                  {option.label}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    isSelected ? "text-[#c4b5fd]" : "text-muted-foreground",
                  )}
                >
                  {option.code}
                </span>
              </button>
            );
          })}
        </div>
      </DrawerContent>
    </NestedDrawer>
  );
}
