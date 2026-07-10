import { CategoryFormPage } from "@/features/categories/components/category-form-page";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return <CategoryFormPage mode="edit" categoryId={categoryId} />;
}
