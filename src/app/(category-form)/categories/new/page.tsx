import { CategoryFormPage } from "@/features/categories/components/category-form-page";
import type { CategoryKind } from "@/features/categories/types";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind } = await searchParams;
  const initialKind: CategoryKind =
    kind === "income" ? "income" : "expense";

  return <CategoryFormPage mode="create" initialKind={initialKind} />;
}
