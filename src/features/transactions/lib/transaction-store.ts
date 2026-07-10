import type { TransactionItem } from "@/features/transactions/types";

let clientTransactions: TransactionItem[] = [];

export function getClientTransactions(): TransactionItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  return clientTransactions;
}

export function prependClientTransaction(transaction: TransactionItem): void {
  if (typeof window === "undefined") {
    return;
  }

  clientTransactions = [transaction, ...clientTransactions];
}
