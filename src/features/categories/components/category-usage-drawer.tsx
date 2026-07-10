"use client";

import { useMemo, type ReactNode } from "react";
import { Pencil, PiggyBank, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryIconGlyph } from "@/features/categories/components/category-icon";
import {
  getCategoryBudgetFillPercent,
  hasCategoryBudget,
} from "@/features/categories/lib/category-display";
import { getCategorySubcategories } from "@/features/categories/lib/categories-store";
import type { CategorySummaryItem } from "@/features/categories/types";
import { usePeriod } from "@/features/period/context/period-provider";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import type { TransactionItem } from "@/features/transactions/types";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface CategoryUsageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategorySummaryItem | null;
  totalExpenses: number;
}

interface UsageBreakdownItem {
  id: string;
  name: string;
  amount: number;
  sharePercent: number;
}

function buildUsageBreakdown(
  category: CategorySummaryItem,
  transactions: TransactionItem[],
): UsageBreakdownItem[] {
  const expenses = transactions.filter((item) => item.type === "expense");
  const totals = new Map<string, { name: string; amount: number }>();

  for (const transaction of expenses) {
    const name =
      transaction.subcategoryName?.trim() || `${category.name} (other)`;
    const key = name.toLowerCase();
    const existing = totals.get(key) ?? { name, amount: 0 };
    existing.amount += Math.abs(transaction.amount);
    totals.set(key, existing);
  }

  if (totals.size === 0 && category.spentAmount > 0) {
    const fallback = getCategorySubcategories(
      category.id,
      category.name,
      category.icon,
    )[0];
    totals.set("fallback", {
      name: fallback?.name ?? `${category.name} (other)`,
      amount: category.spentAmount,
    });
  }

  const items = Array.from(totals.entries()).map(([id, item]) => ({
    id,
    name: item.name,
    amount: item.amount,
    sharePercent:
      category.spentAmount > 0
        ? Math.min(100, Math.round((item.amount / category.spentAmount) * 100))
        : 0,
  }));

  return items.sort((a, b) => b.amount - a.amount);
}

function formatShortPeriodLabel(label: string): string {
  return label
    .replace(/(\d{4})$/, "")
    .replace(/\s+–\s+/g, " – ")
    .trim();
}

export function CategoryUsageDrawer({
  open,
  onOpenChange,
  category,
  totalExpenses,
}: CategoryUsageDrawerProps) {
  const router = useRouter();
  const { displayLabel } = usePeriod();
  const { data: transactionsData } = useTransactions(
    open ? category?.id : null,
  );

  const transactions = useMemo(
    () =>
      transactionsData?.groups.flatMap((group) => group.transactions) ?? [],
    [transactionsData],
  );

  const expenseTransactions = useMemo(
    () => transactions.filter((item) => item.type === "expense"),
    [transactions],
  );

  const breakdown = useMemo(() => {
    if (!category) {
      return [];
    }
    return buildUsageBreakdown(category, expenseTransactions);
  }, [category, expenseTransactions]);

  if (!category) {
    return null;
  }

  const activeCategory = category;
  const transactionCount = expenseTransactions.length;
  const spentAmount =
    expenseTransactions.length > 0
      ? expenseTransactions.reduce(
          (sum, item) => sum + Math.abs(item.amount),
          0,
        )
      : activeCategory.spentAmount;
  const usageOfTotalPercent =
    totalExpenses > 0
      ? Math.min(100, Math.round((spentAmount / totalExpenses) * 100))
      : 0;
  const hasBudget = hasCategoryBudget(activeCategory.budgetedAmount);
  const budgetFillPercent = getCategoryBudgetFillPercent(
    activeCategory.budgetedAmount,
    spentAmount,
  );
  const periodLabel = formatShortPeriodLabel(displayLabel);

  function goToTransactions() {
    onOpenChange(false);
    router.push(
      `/transactions?categoryId=${encodeURIComponent(activeCategory.id)}`,
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-h-[85dvh] max-w-lg gap-0 border-0 bg-transparent px-0 pb-[env(safe-area-inset-bottom)] text-white [&>div:first-child]:hidden">
        {/* Transparent top inset so the floating icon sits on the sheet edge without clipping */}
        <div className="relative pt-7">
          <div
            className="absolute right-5 top-0 z-10 rounded-full bg-white p-1.5 shadow-md"
            aria-hidden="true"
          >
            <span
              className="flex size-12 items-center justify-center rounded-full"
              style={{ color: activeCategory.color }}
            >
              <CategoryIconGlyph
                icon={activeCategory.icon}
                className="size-6"
              />
            </span>
          </div>

          <div
            className="overflow-hidden rounded-t-[1.75rem]"
            style={{ backgroundColor: activeCategory.color }}
          >
            <div className="px-5 pb-2 pt-5">
              <DrawerTitle className="pr-16 text-left text-2xl font-semibold text-white">
                {activeCategory.name}
              </DrawerTitle>

              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="text-sm font-medium text-white/90">
                  {transactionCount}{" "}
                  {transactionCount === 1 ? "transaction" : "transactions"}
                </p>
                <p className="text-lg font-semibold tabular-nums">
                  {formatIdr(spentAmount)}
                </p>
              </div>

              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/25">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${usageOfTotalPercent}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-xs text-white/85">
                  <span className="font-semibold tabular-nums">
                    {usageOfTotalPercent}%
                  </span>
                  <span className="min-w-0 truncate">{periodLabel}</span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {formatIdr(totalExpenses)}
                  </span>
                </div>
              </div>

              {hasBudget ? (
                <div className="mt-4 rounded-2xl bg-black/15 px-3 py-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-white/90">Budget</span>
                    <span className="font-semibold tabular-nums">
                      {formatIdr(activeCategory.budgetedAmount)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${budgetFillPercent}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-white/80">
                    <span>{Math.round(budgetFillPercent)}% used</span>
                    <span className="tabular-nums">
                      {formatIdr(
                        Math.max(
                          0,
                          activeCategory.budgetedAmount - spentAmount,
                        ),
                      )}{" "}
                      left
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="max-h-[40dvh] space-y-3 overflow-y-auto px-5 pb-4 pt-2">
              {breakdown.length === 0 ? (
                <p className="py-4 text-center text-sm text-white/75">
                  No spending in this period
                </p>
              ) : (
                breakdown.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate font-medium">
                        {item.name}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums">
                        {formatIdr(item.amount)}
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/25">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${item.sharePercent}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-3 border-t border-white/20">
              <UsageAction
                label="Edit"
                icon={<Pencil className="size-5" strokeWidth={1.75} />}
                onClick={() => {
                  onOpenChange(false);
                  router.push(
                    `/categories/${encodeURIComponent(activeCategory.id)}/edit`,
                  );
                }}
              />
              <UsageAction
                label="Budget"
                icon={<PiggyBank className="size-5" strokeWidth={1.75} />}
                disabled
              />
              <UsageAction
                label="Transactions"
                icon={<Receipt className="size-5" strokeWidth={1.75} />}
                onClick={goToTransactions}
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function UsageAction({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-1 px-2 py-3.5 text-xs font-medium text-white transition-colors",
        disabled
          ? "cursor-not-allowed opacity-55"
          : "hover:bg-white/10 active:bg-white/15",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
