import type { TransactionItem, TransactionsResponse } from "@/features/transactions/types";

const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx-1",
    accountId: "ocbc",
    accountName: "OCBC",
    accountColor: "#f472b6",
    categoryId: "health",
    categoryName: "Health",
    categoryIcon: "heart-pulse",
    categoryColor: "#4ade80",
    note: "Vitamin",
    amount: -85_000,
    date: "2026-06-19T10:30:00.000Z",
    type: "expense",
  },
  {
    id: "tx-2",
    accountId: "mandiri",
    accountName: "Bank Mandiri",
    accountColor: "#3b82f6",
    categoryId: "obligatory",
    categoryName: "Obligatory",
    subcategoryName: "Food & drink",
    categoryIcon: "heart-pulse",
    categoryColor: "#4ade80",
    note: "Chocolate",
    amount: -24_900,
    date: "2026-06-19T14:15:00.000Z",
    type: "expense",
  },
  {
    id: "tx-3",
    accountId: "cash",
    accountName: "Cash",
    accountColor: "#2dd4bf",
    categoryId: "charity",
    categoryName: "Charity",
    categoryIcon: "hand-coins",
    categoryColor: "#60a5fa",
    note: "Kopi willy",
    amount: -280_000,
    date: "2026-06-19T18:45:00.000Z",
    type: "expense",
  },
  {
    id: "tx-4",
    accountId: "ocbc",
    accountName: "OCBC",
    accountColor: "#f472b6",
    categoryId: "hobby",
    categoryName: "Hobby",
    categoryIcon: "gamepad-2",
    categoryColor: "#a855f7",
    note: "Steam wallet",
    amount: -150_000,
    date: "2026-06-18T20:00:00.000Z",
    type: "expense",
  },
  {
    id: "tx-5",
    accountId: "mandiri",
    accountName: "Bank Mandiri",
    accountColor: "#3b82f6",
    categoryId: "kebutuhan-kos",
    categoryName: "Kebutuhan kos",
    categoryIcon: "home",
    categoryColor: "#84cc16",
    note: "Monthly rent share",
    amount: -500_000,
    date: "2026-06-18T09:00:00.000Z",
    type: "expense",
  },
  {
    id: "tx-6",
    accountId: "ocbc",
    accountName: "OCBC",
    accountColor: "#f472b6",
    categoryId: "non-limit",
    categoryName: "Non-limit",
    categoryIcon: "globe",
    categoryColor: "#fbbf24",
    note: "Salary",
    amount: 8_500_000,
    date: "2026-06-15T08:00:00.000Z",
    type: "income",
  },
  {
    id: "tx-7",
    accountId: "dana",
    accountName: "Dana",
    accountColor: "#22d3ee",
    categoryId: "other-expense",
    categoryName: "Other",
    categoryIcon: "camera",
    categoryColor: "#f472b6",
    note: "Photo print",
    amount: -45_000,
    date: "2026-06-12T16:30:00.000Z",
    type: "expense",
  },
  {
    id: "tx-8",
    accountId: "cash",
    accountName: "Cash",
    accountColor: "#2dd4bf",
    categoryId: "obligatory",
    categoryName: "Obligatory",
    subcategoryName: "Transport",
    categoryIcon: "heart-pulse",
    categoryColor: "#4ade80",
    note: "Grab to office",
    amount: -32_000,
    date: "2026-05-28T07:45:00.000Z",
    type: "expense",
  },
];

export const MOCK_TRANSACTIONS_RESPONSE: TransactionsResponse = {
  startingBalance: 3_098_112,
  endingBalance: 2_024_871,
  groups: [],
};

function toDateKey(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function groupTransactions(transactions: TransactionItem[]) {
  const groupMap = new Map<string, TransactionItem[]>();

  for (const transaction of transactions) {
    const key = toDateKey(transaction.date);
    const existing = groupMap.get(key) ?? [];
    existing.push(transaction);
    groupMap.set(key, existing);
  }

  return Array.from(groupMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({
      date,
      dailyExpenseTotal: items
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + Math.abs(item.amount), 0),
      transactions: items.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    }));
}

function isWithinPeriod(
  isoDate: string,
  periodStart?: Date,
  periodEnd?: Date,
): boolean {
  const date = new Date(isoDate);
  date.setHours(0, 0, 0, 0);

  if (periodStart) {
    const start = new Date(periodStart);
    start.setHours(0, 0, 0, 0);
    if (date < start) return false;
  }

  if (periodEnd) {
    const end = new Date(periodEnd);
    end.setHours(23, 59, 59, 999);
    if (date > end) return false;
  }

  return true;
}

export function buildMockTransactionsResponse(options?: {
  periodStart?: Date;
  periodEnd?: Date;
  accountId?: string;
  categoryId?: string;
}): TransactionsResponse {
  let filtered = [...MOCK_TRANSACTIONS];

  if (options?.periodStart || options?.periodEnd) {
    filtered = filtered.filter((tx) =>
      isWithinPeriod(tx.date, options.periodStart, options.periodEnd),
    );
  }

  if (options?.accountId && options.accountId !== "all") {
    filtered = filtered.filter((tx) => tx.accountId === options.accountId);
  }

  if (options?.categoryId) {
    filtered = filtered.filter((tx) => tx.categoryId === options.categoryId);
  }

  return {
    startingBalance: MOCK_TRANSACTIONS_RESPONSE.startingBalance,
    endingBalance: MOCK_TRANSACTIONS_RESPONSE.endingBalance,
    groups: groupTransactions(filtered),
  };
}
