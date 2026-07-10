import type { CategorySummaryItem } from "@/features/categories/types";

export const MAIN_GRID_CAPACITY = 12;

export const CATEGORY_GRID_CLASS =
  "grid min-h-0 flex-1 grid-cols-4 grid-rows-[7rem_minmax(0,1fr)_minmax(0,1fr)_7rem] gap-1";

export const CATEGORY_EDGE_SLOT_CLASS = "min-h-[7rem]";
export const CATEGORY_FLANK_SLOT_CLASS = "min-h-[7rem]";

export const CATEGORY_DONUT_CELL_CLASS =
  "col-span-2 row-span-2 col-start-2 row-start-2 relative min-h-0 min-w-0";

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
