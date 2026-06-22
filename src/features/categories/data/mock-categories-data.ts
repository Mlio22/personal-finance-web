import type { CategoriesSummaryResponse } from "@/features/categories/types";
import { MOCK_OVERVIEW } from "@/features/categories/data/mock-overview-data";

export { MOCK_OVERVIEW };

export const MOCK_CATEGORIES_SUMMARY: CategoriesSummaryResponse = {
  categories: [
    {
      id: "obligatory",
      name: "Obligatory",
      icon: "heart-pulse",
      color: "#4ade80",
      budgetedAmount: 1_742_276,
      spentAmount: 1_621_138,
    },
    {
      id: "hobby",
      name: "Hobby",
      icon: "gamepad-2",
      color: "#a855f7",
      budgetedAmount: 300_000,
      spentAmount: 0,
    },
    {
      id: "kebutuhan-kos",
      name: "Kebutuhan kos",
      icon: "home",
      color: "#84cc16",
      budgetedAmount: 2_030_850,
      spentAmount: 1_979_000,
    },
    {
      id: "other-expense",
      name: "Other",
      icon: "camera",
      color: "#f472b6",
      budgetedAmount: 482_476,
      spentAmount: 396_238,
    },
    {
      id: "charity",
      name: "Charity",
      icon: "hand-coins",
      color: "#60a5fa",
      budgetedAmount: 0,
      spentAmount: 213_227,
    },
    {
      id: "non-limit",
      name: "Non-limit",
      icon: "globe",
      color: "#fbbf24",
      budgetedAmount: 3_204_842,
      spentAmount: 2_767_781,
    },
    {
      id: "health",
      name: "Health",
      icon: "heart-pulse",
      color: "#4ade80",
      budgetedAmount: 0,
      spentAmount: 336_285,
    },
    {
      id: "mission",
      name: "Mission",
      icon: "zap",
      color: "#ef4444",
      budgetedAmount: 0,
      spentAmount: 0,
    },
    {
      id: "invest-loss",
      name: "Invest loss",
      icon: "circle-dollar-sign",
      color: "#b91c1c",
      budgetedAmount: 0,
      spentAmount: 0,
    },
    {
      id: "self-improvement",
      name: "Self Improve...",
      icon: "sparkles",
      color: "#fbbf24",
      budgetedAmount: 600_000,
      spentAmount: 17_760,
    },
    {
      id: "other-misc",
      name: "Other",
      icon: "ellipsis",
      color: "#9ca3af",
      budgetedAmount: 0,
      spentAmount: 1_065_286,
    },
  ],
};

