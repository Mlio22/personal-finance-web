import { adjustAccountBalanceInMockCache } from "@/features/accounts/lib/account-store";
import { addCategorySpent } from "@/features/categories/lib/categories-store";
import type { CategoryExpenseConfirmPayload } from "@/features/categories/components/category-expense-drawer";
import { addOverviewIncome } from "@/features/categories/lib/overview-store";
import { prependClientTransaction } from "@/features/transactions/lib/transaction-store";
import type { TransactionItem } from "@/features/transactions/types";

function buildTransactionId(): string {
  return `tx-${Date.now().toString(36)}`;
}

export function createIncomeTransaction(
  payload: CategoryExpenseConfirmPayload,
): TransactionItem {
  adjustAccountBalanceInMockCache(payload.accountId, payload.amount);
  addCategorySpent(payload.categoryId, payload.amount);
  addOverviewIncome(payload.amount);

  const transaction: TransactionItem = {
    id: buildTransactionId(),
    accountId: payload.accountId,
    accountName: payload.accountName,
    accountColor: payload.accountColor,
    categoryId: payload.categoryId,
    categoryName: payload.categoryName,
    subcategoryName: payload.subcategoryName,
    categoryIcon: payload.categoryIcon,
    categoryColor: payload.categoryColor,
    note: payload.notes,
    amount: payload.amount,
    date: payload.date.toISOString(),
    type: "income",
  };

  prependClientTransaction(transaction);
  return transaction;
}
