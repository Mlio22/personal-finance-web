export interface CategorySubcategory {
  id: string;
  name: string;
  icon: string;
}

export const MOCK_CATEGORY_SUBCATEGORIES: Record<string, CategorySubcategory[]> =
  {
    hobby: [
      { id: "entertainment", name: "Entertainment", icon: "gamepad-2" },
      { id: "hobby", name: "Hobby", icon: "music" },
      { id: "event", name: "Event", icon: "globe" },
    ],
    obligatory: [
      { id: "food-drink", name: "Food & drink", icon: "utensils" },
      { id: "belanja-bulanan", name: "Belanja bulanan", icon: "shopping-basket" },
      { id: "makan-hedon", name: "Makan hedon", icon: "wine" },
      { id: "buah", name: "Buah", icon: "apple" },
      { id: "minum", name: "Minum", icon: "cup-soda" },
      { id: "jajan", name: "Jajan", icon: "candy" },
      { id: "health", name: "Health", icon: "heart-pulse" },
      { id: "bills", name: "Bills", icon: "receipt" },
      { id: "family", name: "Family", icon: "hand-coins" },
    ],
    "kebutuhan-kos": [
      { id: "rent", name: "Rent", icon: "home" },
      { id: "utilities", name: "Utilities", icon: "zap" },
    ],
  };
