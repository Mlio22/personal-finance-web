import { MOCK_CATEGORIES_SUMMARY } from "@/features/categories/data/mock-categories-data";
import {
  MOCK_CATEGORY_SUBCATEGORIES,
  type CategorySubcategory,
} from "@/features/categories/data/mock-category-subcategories";
import type {
  CategoriesSummaryResponse,
  CategoryFormValues,
  CategoryKind,
  CategorySubcategoryFormValue,
  CategorySummaryItem,
} from "@/features/categories/types";

let clientCategoriesCache: CategoriesSummaryResponse | null = null;
let clientSubcategoriesCache: Record<string, CategorySubcategory[]> | null =
  null;

function slugifyName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "category";
}

export function getClientCategoriesSummary(): CategoriesSummaryResponse {
  if (typeof window === "undefined") {
    return MOCK_CATEGORIES_SUMMARY;
  }

  if (!clientCategoriesCache) {
    clientCategoriesCache = structuredClone(MOCK_CATEGORIES_SUMMARY);
  }

  return clientCategoriesCache;
}

export function getClientSubcategoriesMap(): Record<
  string,
  CategorySubcategory[]
> {
  if (typeof window === "undefined") {
    return MOCK_CATEGORY_SUBCATEGORIES;
  }

  if (!clientSubcategoriesCache) {
    clientSubcategoriesCache = structuredClone(MOCK_CATEGORY_SUBCATEGORIES);
  }

  return clientSubcategoriesCache;
}

export function getClientSubcategories(
  categoryId: string,
): CategorySubcategory[] {
  return getClientSubcategoriesMap()[categoryId] ?? [];
}

export function getCategorySubcategories(
  categoryId: string,
  categoryName: string,
  categoryIcon: string,
): CategorySubcategory[] {
  if (typeof window !== "undefined") {
    const client = getClientSubcategories(categoryId);
    if (client.length > 0) {
      return client;
    }
  }

  return (
    MOCK_CATEGORY_SUBCATEGORIES[categoryId] ?? [
      { id: categoryId, name: categoryName, icon: categoryIcon },
    ]
  );
}

export type { CategorySubcategory };

export function findCategoryById(
  categoryId: string,
): CategorySummaryItem | undefined {
  return getClientCategoriesSummary().categories.find(
    (category) => category.id === categoryId,
  );
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

export function defaultCategoryFormValues(
  kind: CategoryKind = "expense",
): CategoryFormValues {
  return {
    name: "",
    icon: kind === "income" ? "circle-dollar-sign" : "shopping-cart",
    color: kind === "income" ? "#34d399" : "#a16207",
    kind,
    currency: "IDR",
    archived: false,
    subcategories: [],
  };
}

export function categoryToFormValues(
  category: CategorySummaryItem,
): CategoryFormValues {
  const subcategories = getClientSubcategories(category.id).map((item) => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
  }));

  return {
    name: category.name,
    icon: category.icon,
    color: category.color,
    kind: category.kind ?? "expense",
    currency: category.currency ?? "IDR",
    archived: category.archived ?? false,
    subcategories,
  };
}

export function createCategoryFromForm(
  values: CategoryFormValues,
): CategorySummaryItem {
  return {
    id: `${slugifyName(values.name)}-${Date.now().toString(36)}`,
    name: values.name.trim() || "Untitled category",
    icon: values.icon,
    color: values.color,
    budgetedAmount: 0,
    spentAmount: 0,
    kind: values.kind,
    currency: values.currency,
    archived: values.archived,
  };
}

export function applyFormValuesToCategory(
  category: CategorySummaryItem,
  values: CategoryFormValues,
): CategorySummaryItem {
  return {
    ...category,
    name: values.name.trim() || category.name,
    icon: values.icon,
    color: values.color,
    kind: values.kind,
    currency: values.currency,
    archived: values.archived,
  };
}

export function upsertCategoryInMockCache(
  category: CategorySummaryItem,
  subcategories?: CategorySubcategoryFormValue[],
): CategoriesSummaryResponse {
  const current = getClientCategoriesSummary();
  const exists = current.categories.some((item) => item.id === category.id);
  const nextCategories = exists
    ? current.categories.map((item) =>
        item.id === category.id ? category : item,
      )
    : [...current.categories, category];

  clientCategoriesCache = { categories: nextCategories };

  if (subcategories) {
    const map = getClientSubcategoriesMap();
    clientSubcategoriesCache = {
      ...map,
      [category.id]: subcategories.map((item) => ({
        id: item.id,
        name: item.name,
        icon: item.icon,
      })),
    };
  }

  return clientCategoriesCache;
}

export function deleteCategoryFromMockCache(
  categoryId: string,
): CategoriesSummaryResponse {
  const current = getClientCategoriesSummary();
  clientCategoriesCache = {
    categories: current.categories.filter(
      (category) => category.id !== categoryId,
    ),
  };

  const map = getClientSubcategoriesMap();
  const nextMap = { ...map };
  delete nextMap[categoryId];
  clientSubcategoriesCache = nextMap;

  return clientCategoriesCache;
}

export function createSubcategoryId(name: string): string {
  return `${slugifyName(name)}-${Date.now().toString(36)}`;
}
