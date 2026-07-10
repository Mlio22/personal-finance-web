"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Account } from "@/features/accounts/types";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
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
import {
  AmountKeypad,
  type AmountKeypadAction,
} from "@/components/amount-input/amount-keypad";
import { CategoryIcon } from "@/features/categories/components/category-icon";
import {
  getCategorySubcategories,
  type CategorySubcategory,
} from "@/features/categories/data/mock-category-subcategories";
import type { CategorySummaryItem } from "@/features/categories/types";
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
  subcategoryId: string;
  subcategoryName: string;
  accountId: string;
  categoryId: string;
}

interface CategoryExpenseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategorySummaryItem | null;
  account: Account | null;
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

export function CategoryExpenseDrawer({
  open,
  onOpenChange,
  category,
  account,
  onConfirm,
}: CategoryExpenseDrawerProps) {
  const [expression, setExpression] = useState<AmountExpressionState>(() =>
    createAmountExpression(0),
  );
  const [notes, setNotes] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);

  const subcategories = useMemo<CategorySubcategory[]>(() => {
    if (!category) {
      return [];
    }

    return getCategorySubcategories(
      category.id,
      category.name,
      category.icon,
    );
  }, [category]);

  const selectedSubcategory =
    subcategories.find((item) => item.id === selectedSubcategoryId) ??
    subcategories[0] ??
    null;

  useEffect(() => {
    if (!open || !category) {
      return;
    }

    setExpression(createAmountExpression(0));
    setNotes("");
    setSelectedSubcategoryId(
      getCategorySubcategories(category.id, category.name, category.icon)[0]
        ?.id ?? null,
    );
  }, [open, category]);

  const displayValue = useMemo(
    () => formatExpressionDisplay(expression, account?.currency ?? "IDR"),
    [expression, account?.currency],
  );

  const pendingOperation = hasPendingOperation(expression);
  const accentColor = category?.color ?? "#a855f7";

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

    if (!category || !account || !selectedSubcategory) {
      return;
    }

    const evaluated = evaluateExpression(expression) ?? 0;
    if (evaluated <= 0) {
      return;
    }

    onConfirm?.({
      amount: evaluated,
      notes: notes.trim(),
      subcategoryId: selectedSubcategory.id,
      subcategoryName: selectedSubcategory.name,
      accountId: account.id,
      categoryId: category.id,
    });
    onOpenChange(false);
  }

  if (!category || !account) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-h-[92dvh] max-w-lg gap-0 overflow-y-auto rounded-t-[1.75rem] border-0 bg-[#1c1c1e] px-0 pb-[env(safe-area-inset-bottom)] [&>div:first-child]:mt-2.5 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[#3a3a3c]">
        <DrawerTitle className="sr-only">
          Add expense to {category.name}
        </DrawerTitle>

        <div className="grid grid-cols-2 gap-2 px-4 pb-3 pt-2">
          <EndpointCard
            label="From account"
            name={account.name}
            color={account.color ?? "#0ea5e9"}
            icon={
              <AccountAvatar
                name={account.name}
                color={account.color}
                icon={account.icon}
                className="size-11"
              />
            }
          />
          <EndpointCard
            label="To category"
            name={category.name}
            color={category.color}
            icon={
              <CategoryIcon
                icon={category.icon}
                color={category.color}
                className="flex size-11 items-center justify-center rounded-2xl"
              />
            }
          />
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
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : { borderColor: accentColor, color: accentColor }
                  }
                >
                  <CategoryIcon
                    icon={subcategory.icon}
                    color={isActive ? accentColor : accentColor}
                    className={cn(
                      "flex size-5 items-center justify-center rounded-md",
                      isActive && "bg-white",
                    )}
                  />
                  <span>{subcategory.name}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="px-5 pb-3 text-center">
          <p className="text-sm font-medium text-expense">Expense</p>
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

        <AmountKeypad
          pendingOperation={pendingOperation}
          onAction={applyAction}
          onConfirm={handleConfirm}
          onClear={() => setExpression(clearExpression())}
          confirmClassName="bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] border-[#7c3aed]"
        />

        <p className="px-4 py-3 text-center text-sm text-muted-foreground">
          {formatExpenseDateLabel(new Date())}
        </p>
      </DrawerContent>
    </Drawer>
  );
}

function EndpointCard({
  label,
  name,
  color,
  icon,
}: {
  label: string;
  name: string;
  color: string;
  icon: ReactNode;
}) {
  return (
    <div
      className="relative rounded-2xl px-3 pb-3 pt-8 text-center text-white"
      style={{ backgroundColor: color }}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#1c1c1e] p-1">
        {icon}
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-white/80">
        {label}
      </p>
      <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-tight">
        {name}
      </p>
    </div>
  );
}
