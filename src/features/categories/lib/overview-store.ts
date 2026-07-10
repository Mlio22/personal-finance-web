import { MOCK_OVERVIEW } from "@/features/categories/data/mock-overview-data";
import type { OverviewResponse } from "@/features/categories/types";

let clientOverviewCache: OverviewResponse | null = null;

export function getClientOverview(): OverviewResponse {
  if (typeof window === "undefined") {
    return MOCK_OVERVIEW;
  }

  if (!clientOverviewCache) {
    clientOverviewCache = structuredClone(MOCK_OVERVIEW);
  }

  return clientOverviewCache;
}

export function addOverviewExpense(amount: number): void {
  if (typeof window === "undefined" || amount <= 0) {
    return;
  }

  const current = getClientOverview();
  clientOverviewCache = {
    ...current,
    expenses: current.expenses + amount,
    balance: current.balance - amount,
  };
}

export function addOverviewIncome(amount: number): void {
  if (typeof window === "undefined" || amount <= 0) {
    return;
  }

  const current = getClientOverview();
  clientOverviewCache = {
    ...current,
    income: current.income + amount,
    balance: current.balance + amount,
  };
}
