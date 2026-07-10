"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Account } from "@/features/accounts/types";
import {
  ACCOUNT_ICON_MAP,
} from "@/features/accounts/components/account-avatar";
import {
  appendDecimal,
  appendDigit,
  backspace,
  clearExpression,
  createAmountExpression,
  equals,
  evaluateExpression,
  formatExpressionDisplay,
  hasPendingOperation,
  setOperator,
  type AmountExpressionState,
} from "@/components/amount-input/amount-expression";
import { type AmountKeypadAction } from "@/components/amount-input/amount-keypad";
import { ExpenseAmountKeypad } from "@/components/amount-input/expense-amount-keypad";
import { CategoryIconGlyph } from "@/features/categories/components/category-icon";
import {
  ExpenseAccountPickerDrawer,
  ExpenseCategoryPickerDrawer,
  ExpenseCurrencyPickerDrawer,
  ExpenseDatePickerDrawer,
} from "@/features/categories/components/expense-picker-drawers";
import {
  getCategorySubcategories,
  type CategorySubcategory,
} from "@/features/categories/lib/categories-store";
import type {
  RecurrenceValue,
  ReminderValue,
} from "@/features/categories/lib/transaction-schedule-options";
import type { CategoryKind, CategorySummaryItem } from "@/features/categories/types";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface CategoryExpenseConfirmPayload {
  amount: number;
  notes: string;
  subcategoryId?: string;
  subcategoryName?: string;
  accountId: string;
  accountName: string;
  accountColor: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  currency: string;
  date: Date;
  recurrence?: RecurrenceValue;
  reminder?: ReminderValue;
}

interface CategoryExpenseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategorySummaryItem | null;
  account: Account | null;
  accounts: Account[];
  categories: CategorySummaryItem[];
  transactionKind?: CategoryKind;
  onConfirm?: (payload: CategoryExpenseConfirmPayload) => void;
}

function formatExpenseDateLabel(date: Date): string {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return isToday ? `Today, ${formatted}` : formatted;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

export function CategoryExpenseDrawer({
  open,
  onOpenChange,
  category,
  account,
  accounts,
  categories,
  transactionKind = "expense",
  onConfirm,
}: CategoryExpenseDrawerProps) {
  const [expression, setExpression] = useState<AmountExpressionState>(() =>
    createAmountExpression(0),
  );
  const [notes, setNotes] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [selectedCurrency, setSelectedCurrency] = useState("IDR");
  const [selectedRecurrence, setSelectedRecurrence] =
    useState<RecurrenceValue>("none");
  const [selectedReminder, setSelectedReminder] =
    useState<ReminderValue>("none");
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);

  const nestedPickerOpen =
    accountPickerOpen ||
    categoryPickerOpen ||
    datePickerOpen ||
    currencyPickerOpen;

  const activeAccount = useMemo(() => {
    if (selectedAccountId) {
      return accounts.find((item) => item.id === selectedAccountId) ?? account;
    }
    return account;
  }, [account, accounts, selectedAccountId]);

  const activeCategory = useMemo(() => {
    if (selectedCategoryId) {
      return (
        categories.find((item) => item.id === selectedCategoryId) ?? category
      );
    }
    return category;
  }, [categories, category, selectedCategoryId]);

  const subcategories = useMemo<CategorySubcategory[]>(() => {
    if (!activeCategory) {
      return [];
    }

    return getCategorySubcategories(activeCategory.id);
  }, [activeCategory]);

  const selectedSubcategory =
    subcategories.find((item) => item.id === selectedSubcategoryId) ??
    subcategories[0] ??
    null;

  useEffect(() => {
    if (!open || !category || !account) {
      return;
    }

    setExpression(createAmountExpression(0));
    setNotes("");
    setSelectedAccountId(account.id);
    setSelectedCategoryId(category.id);
    setSelectedDate(startOfDay(new Date()));
    setSelectedCurrency(account.currency ?? "IDR");
    setSelectedRecurrence("none");
    setSelectedReminder("none");
    setSelectedSubcategoryId(
      getCategorySubcategories(category.id)[0]?.id ?? null,
    );
    setAccountPickerOpen(false);
    setCategoryPickerOpen(false);
    setDatePickerOpen(false);
    setCurrencyPickerOpen(false);
  }, [open, category, account]);

  const displayValue = useMemo(
    () => formatExpressionDisplay(expression, selectedCurrency),
    [expression, selectedCurrency],
  );

  const pendingOperation = hasPendingOperation(expression);
  const accentColor = activeCategory?.color ?? "#a855f7";
  const isIncome = transactionKind === "income";
  const transactionLabel = isIncome ? "Income" : "Expense";

  function handleParentOpenChange(nextOpen: boolean) {
    // Nested pickers must close first — never dismiss the transaction modal
    // while a child sheet is open (vaul can bubble dismiss events).
    if (!nextOpen && nestedPickerOpen) {
      return;
    }
    onOpenChange(nextOpen);
  }

  function applyAction(action: AmountKeypadAction) {
    setExpression((current) => {
      switch (action.kind) {
        case "digit":
          return appendDigit(current, action.value);
        case "decimal":
          return appendDecimal(current);
        case "backspace":
          return backspace(current);
        case "operator":
          return setOperator(current, action.value);
      }
    });
  }

  function handleConfirm() {
    if (pendingOperation) {
      setExpression((current) => equals(current));
      return;
    }

    if (!activeCategory || !activeAccount) {
      return;
    }

    const evaluated = evaluateExpression(expression) ?? 0;
    if (evaluated <= 0) {
      return;
    }

    onConfirm?.({
      amount: evaluated,
      notes: notes.trim(),
      subcategoryId: selectedSubcategory?.id,
      subcategoryName: selectedSubcategory?.name,
      accountId: activeAccount.id,
      accountName: activeAccount.name,
      accountColor: activeAccount.color ?? "#14b8a6",
      categoryId: activeCategory.id,
      categoryName: activeCategory.name,
      categoryIcon: activeCategory.icon,
      categoryColor: activeCategory.color,
      currency: selectedCurrency,
      date: selectedDate,
      recurrence: selectedRecurrence,
      reminder: selectedReminder,
    });
    onOpenChange(false);
  }

  if (!category || !account || !activeCategory || !activeAccount) {
    return null;
  }

  const AccountIcon =
    activeAccount.icon && ACCOUNT_ICON_MAP[activeAccount.icon]
      ? ACCOUNT_ICON_MAP[activeAccount.icon]
      : ACCOUNT_ICON_MAP.wallet;

  return (
    <Drawer
      open={open}
      onOpenChange={handleParentOpenChange}
      dismissible={!nestedPickerOpen}
    >
      <DrawerContent className="mx-auto max-h-[92dvh] max-w-lg gap-0 overflow-y-auto rounded-t-[1.75rem] border-0 bg-[#1c1c1e] px-0 pb-[env(safe-area-inset-bottom)] [&>div:first-child]:mt-2.5 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[#3a3a3c]">
        <DrawerTitle className="sr-only">
          Add {transactionLabel.toLowerCase()} {isIncome ? "from" : "to"}{" "}
          {activeCategory.name}
        </DrawerTitle>

        <div className="grid grid-cols-2 gap-2.5 px-4 pb-3 pt-3">
          {isIncome ? (
            <>
              <EndpointCard
                label="From category"
                name={activeCategory.name}
                color={activeCategory.color}
                onClick={() => setCategoryPickerOpen(true)}
                icon={
                  <span
                    className="flex size-11 items-center justify-center rounded-full bg-white"
                    style={{ color: activeCategory.color }}
                  >
                    <CategoryIconGlyph
                      icon={activeCategory.icon}
                      className="size-5"
                    />
                  </span>
                }
              />
              <EndpointCard
                label="To account"
                name={activeAccount.name}
                color={activeAccount.color ?? "#0ea5e9"}
                onClick={() => setAccountPickerOpen(true)}
                icon={
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white">
                    <AccountIcon
                      className="size-5"
                      strokeWidth={1.75}
                      style={{ color: activeAccount.color ?? "#0ea5e9" }}
                      aria-hidden="true"
                    />
                  </span>
                }
              />
            </>
          ) : (
            <>
              <EndpointCard
                label="From account"
                name={activeAccount.name}
                color={activeAccount.color ?? "#0ea5e9"}
                onClick={() => setAccountPickerOpen(true)}
                icon={
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white">
                    <AccountIcon
                      className="size-5"
                      strokeWidth={1.75}
                      style={{ color: activeAccount.color ?? "#0ea5e9" }}
                      aria-hidden="true"
                    />
                  </span>
                }
              />
              <EndpointCard
                label="To category"
                name={activeCategory.name}
                color={activeCategory.color}
                onClick={() => setCategoryPickerOpen(true)}
                icon={
                  <span
                    className="flex size-11 items-center justify-center rounded-full bg-white"
                    style={{ color: activeCategory.color }}
                  >
                    <CategoryIconGlyph
                      icon={activeCategory.icon}
                      className="size-5"
                    />
                  </span>
                }
              />
            </>
          )}
        </div>

        {subcategories.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto px-4 pb-3">
            {subcategories.map((subcategory) => {
              const isActive = selectedSubcategory?.id === subcategory.id;

              return (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => setSelectedSubcategoryId(subcategory.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-transparent text-white"
                      : "border-current bg-transparent text-foreground/90",
                  )}
                  style={
                    isActive
                      ? {
                          backgroundColor: accentColor,
                          borderColor: accentColor,
                        }
                      : { borderColor: accentColor, color: accentColor }
                  }
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-md",
                      isActive ? "bg-white" : "bg-transparent",
                    )}
                    style={{ color: accentColor }}
                  >
                    <CategoryIconGlyph
                      icon={subcategory.icon}
                      className="size-3.5"
                    />
                  </span>
                  <span>{subcategory.name}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="px-5 pb-3 text-center">
          <p
            className="text-sm font-medium"
            style={{ color: accentColor }}
          >
            {transactionLabel}
          </p>
          <p
            className="mt-1 min-h-[2.5rem] text-[1.75rem] font-semibold tabular-nums tracking-tight"
            style={{ color: accentColor }}
          >
            {displayValue}
          </p>
        </div>

        <div className="px-4 pb-3">
          <Input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notes..."
            className="h-11 rounded-xl border-[#3a3a3c] bg-[#2c2c2e] px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-[#4a4a4c] focus-visible:ring-0"
          />
        </div>

        <ExpenseAmountKeypad
          pendingOperation={pendingOperation}
          onAction={applyAction}
          onConfirm={handleConfirm}
          onClear={() => setExpression(clearExpression())}
          currency={selectedCurrency}
          onCalendarPress={() => setDatePickerOpen(true)}
          onCurrencyPress={() => setCurrencyPickerOpen(true)}
        />

        <button
          type="button"
          onClick={() => setDatePickerOpen(true)}
          className="w-full px-4 py-3 text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {formatExpenseDateLabel(selectedDate)}
        </button>

        <ExpenseAccountPickerDrawer
          open={accountPickerOpen}
          onOpenChange={setAccountPickerOpen}
          accounts={accounts}
          selectedAccountId={activeAccount.id}
          onSelect={(accountId) => {
            setSelectedAccountId(accountId);
            const nextAccount = accounts.find((item) => item.id === accountId);
            if (nextAccount?.currency) {
              setSelectedCurrency(nextAccount.currency);
            }
          }}
        />

        <ExpenseCategoryPickerDrawer
          open={categoryPickerOpen}
          onOpenChange={setCategoryPickerOpen}
          categories={categories}
          selectedCategoryId={activeCategory.id}
          onSelect={(categoryId) => {
            setSelectedCategoryId(categoryId);
            const nextCategory = categories.find(
              (item) => item.id === categoryId,
            );
            if (nextCategory) {
              setSelectedSubcategoryId(
                getCategorySubcategories(nextCategory.id)[0]?.id ?? null,
              );
            }
          }}
        />

        <ExpenseDatePickerDrawer
          open={datePickerOpen}
          onOpenChange={setDatePickerOpen}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          selectedRecurrence={selectedRecurrence}
          onRecurrenceChange={setSelectedRecurrence}
          selectedReminder={selectedReminder}
          onReminderChange={setSelectedReminder}
        />

        <ExpenseCurrencyPickerDrawer
          open={currencyPickerOpen}
          onOpenChange={setCurrencyPickerOpen}
          selectedCurrency={selectedCurrency}
          onSelect={setSelectedCurrency}
        />
      </DrawerContent>
    </Drawer>
  );
}

function EndpointCard({
  label,
  name,
  color,
  icon,
  onClick,
}: {
  label: string;
  name: string;
  color: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-2xl px-3 pb-3.5 pt-9 text-center text-white transition-opacity hover:opacity-95 active:opacity-90"
      style={{ backgroundColor: color }}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        {icon}
      </div>
      <p className="text-[11px] font-medium text-white/85">{label}</p>
      <p className="mt-0.5 line-clamp-2 text-base font-semibold leading-tight">
        {name}
      </p>
    </button>
  );
}
