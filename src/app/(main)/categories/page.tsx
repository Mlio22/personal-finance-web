import { CategoriesScreen } from "@/features/categories/components/categories-screen";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CategoriesScreen initialCategoryId={categoryId ?? null} />
    </div>
  );
}
