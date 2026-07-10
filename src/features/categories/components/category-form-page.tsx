"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryFormScreen } from "@/features/categories/components/category-form-screen";
import {
  applyFormValuesToCategory,
  categoryToFormValues,
  createCategoryFromForm,
  defaultCategoryFormValues,
  deleteCategoryFromMockCache,
  findCategoryById,
  getClientCategoriesSummary,
  upsertCategoryInMockCache,
} from "@/features/categories/lib/categories-store";
import type {
  CategoryFormMode,
  CategoryFormValues,
  CategoryKind,
  CategorySummaryItem,
} from "@/features/categories/types";

interface CategoryFormPageProps {
  mode: CategoryFormMode;
  categoryId?: string;
  initialKind?: CategoryKind;
}

export function CategoryFormPage({
  mode,
  categoryId,
  initialKind = "expense",
}: CategoryFormPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(mode === "create");
  const [existingCategory, setExistingCategory] = useState<
    CategorySummaryItem | undefined
  >();

  useEffect(() => {
    if (mode !== "edit" || !categoryId) {
      setReady(true);
      return;
    }

    setExistingCategory(findCategoryById(categoryId));
    setReady(true);
  }, [mode, categoryId]);

  function handleClose() {
    router.back();
  }

  function syncCategoriesQuery() {
    const next = getClientCategoriesSummary();
    void queryClient.invalidateQueries({ queryKey: ["categories"] });
    void queryClient.invalidateQueries({ queryKey: ["overview"] });
    void queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.setQueriesData(
      { queryKey: ["categories", "summary"] },
      next,
    );
  }

  function handleSubmit(values: CategoryFormValues) {
    if (mode === "edit" && existingCategory) {
      upsertCategoryInMockCache(
        applyFormValuesToCategory(existingCategory, values),
        values.subcategories,
      );
    } else {
      const created = createCategoryFromForm(values);
      upsertCategoryInMockCache(created, values.subcategories);
    }

    syncCategoriesQuery();
    router.push("/categories?edit=1");
  }

  function handleDelete() {
    if (!existingCategory) return;
    deleteCategoryFromMockCache(existingCategory.id);
    syncCategoriesQuery();
    router.push("/categories?edit=1");
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-8 space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-16 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (mode === "edit" && !existingCategory) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-sm text-muted-foreground">Category not found.</p>
        <button
          type="button"
          className="text-sm font-medium text-[#c4b5fd]"
          onClick={() => router.push("/categories?edit=1")}
        >
          Back to edit categories
        </button>
      </div>
    );
  }

  return (
    <CategoryFormScreen
      mode={mode}
      initialValues={
        mode === "edit" && existingCategory
          ? categoryToFormValues(existingCategory)
          : defaultCategoryFormValues(initialKind)
      }
      onClose={handleClose}
      onSubmit={handleSubmit}
      onDelete={mode === "edit" ? handleDelete : undefined}
    />
  );
}
