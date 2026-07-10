import type { CategorySummaryItem } from "@/features/categories/types";

export const MAIN_GRID_CAPACITY = 12;

export interface CategoryGridPartition {
  top: (CategorySummaryItem | null)[];
  middleLeft: (CategorySummaryItem | null)[];
  middleRight: (CategorySummaryItem | null)[];
  bottom: (CategorySummaryItem | null)[];
  overflow: CategorySummaryItem[];
}

export function partitionCategoryGrid(
  categories: CategorySummaryItem[],
): CategoryGridPartition {
  const main = Array.from({ length: MAIN_GRID_CAPACITY }, (_, index) => {
    return categories[index] ?? null;
  });
  const overflow = categories.slice(MAIN_GRID_CAPACITY);

  return {
    top: main.slice(0, 4),
    middleLeft: [main[4], main[6]],
    middleRight: [main[5], main[7]],
    bottom: main.slice(8, 12),
    overflow,
  };
}
