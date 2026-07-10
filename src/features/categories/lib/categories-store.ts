import { MOCK_CATEGORIES_SUMMARY } from "@/features/categories/data/mock-categories-data";
import type { CategoriesSummaryResponse } from "@/features/categories/types";

let clientCategoriesCache: CategoriesSummaryResponse | null = null;

export function getClientCategoriesSummary(): CategoriesSummaryResponse {
  if (typeof window === "undefined") {
    return MOCK_CATEGORIES_SUMMARY;
  }

  if (!clientCategoriesCache) {
    clientCategoriesCache = structuredClone(MOCK_CATEGORIES_SUMMARY);
  }

  return clientCategoriesCache;
}

export function addCategorySpent(categoryId: string, amount: number): void {
  if (typeof window === "undefined" || amount <= 0) {
    return;
  }

  const current = getClientCategoriesSummary();
  clientCategoriesCache = {
    categories: current.categories.map((category) =>
      category.id === categoryId
        ? { ...category, spentAmount: category.spentAmount + amount }
        : category,
    ),
  };
}
