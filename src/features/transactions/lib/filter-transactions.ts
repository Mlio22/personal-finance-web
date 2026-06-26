import type { TransactionsResponse } from "@/features/transactions/types";

function matchesSearch(
  query: string,
  values: Array<string | undefined>,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return values.some((value) => value?.toLowerCase().includes(normalized));
}

export function filterTransactionsBySearch(
  data: TransactionsResponse,
  query: string,
): TransactionsResponse {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return data;

  const groups = data.groups
    .map((group) => ({
      ...group,
      transactions: group.transactions.filter((transaction) =>
        matchesSearch(normalized, [
          transaction.note,
          transaction.categoryName,
          transaction.subcategoryName,
          transaction.accountName,
        ]),
      ),
    }))
    .filter((group) => group.transactions.length > 0)
    .map((group) => ({
      ...group,
      dailyExpenseTotal: group.transactions
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + Math.abs(item.amount), 0),
    }));

  return {
    ...data,
    groups,
  };
}
