export interface CategorySubcategory {
  id: string;
  name: string;
  icon: string;
}

export const MOCK_CATEGORY_SUBCATEGORIES: Record<string, CategorySubcategory[]> =
  {
    hobby: [
      { id: "entertainment", name: "Entertainment", icon: "gamepad-2" },
      { id: "hobby", name: "Hobby", icon: "gamepad-2" },
      { id: "event", name: "Event", icon: "globe" },
    ],
    obligatory: [
      { id: "bills", name: "Bills", icon: "heart-pulse" },
      { id: "family", name: "Family", icon: "hand-coins" },
    ],
    "kebutuhan-kos": [
      { id: "rent", name: "Rent", icon: "home" },
      { id: "utilities", name: "Utilities", icon: "zap" },
    ],
  };

export function getCategorySubcategories(
  categoryId: string,
  categoryName: string,
  categoryIcon: string,
): CategorySubcategory[] {
  return (
    MOCK_CATEGORY_SUBCATEGORIES[categoryId] ?? [
      { id: categoryId, name: categoryName, icon: categoryIcon },
    ]
  );
}
