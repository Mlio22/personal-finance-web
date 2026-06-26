export type TransactionType = "expense" | "income" | "transfer";

export interface TransactionItem {
  id: string;
  accountId: string;
  accountName: string;
  accountColor: string;
  categoryId: string;
  categoryName: string;
  subcategoryName?: string;
  categoryIcon: string;
  categoryColor: string;
  note: string;
  amount: number;
  date: string;
  type: TransactionType;
}

export interface TransactionDateGroup {
  date: string;
  dailyExpenseTotal: number;
  transactions: TransactionItem[];
}

export interface TransactionsResponse {
  startingBalance: number;
  endingBalance: number;
  groups: TransactionDateGroup[];
}
