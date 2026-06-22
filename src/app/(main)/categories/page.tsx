import { CategoriesScreen } from "@/features/categories/components/categories-screen";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;

  return <CategoriesScreen initialCategoryId={categoryId ?? null} />;
}
