import { Suspense } from "react";
import { CategoriesScreen } from "@/features/categories/components/categories-screen";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; edit?: string }>;
}) {
  const { categoryId } = await searchParams;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Suspense
        fallback={
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="h-full animate-pulse rounded-xl bg-muted/60" />
          </div>
        }
      >
        <CategoriesScreen initialCategoryId={categoryId ?? null} />
      </Suspense>
    </div>
  );
}
