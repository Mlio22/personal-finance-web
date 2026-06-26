import type {
  DailyBreakdownItem,
  OverviewResponse,
} from "@/features/categories/types";

function createDailyBreakdown(): DailyBreakdownItem[] {
  const start = new Date(2026, 4, 20);
  const patterns = [
    { green: 420_000, yellow: 280_000, grey: 95_000 },
    { green: 180_000, yellow: 520_000, grey: 140_000 },
    { green: 650_000, yellow: 120_000, grey: 210_000 },
    { green: 90_000, yellow: 340_000, grey: 75_000 },
    { green: 510_000, yellow: 190_000, grey: 160_000 },
    { green: 240_000, yellow: 410_000, grey: 130_000 },
    { green: 720_000, yellow: 85_000, grey: 190_000 },
  ];

  return Array.from({ length: 31 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const pattern = patterns[index % patterns.length];
    const variance = 0.75 + (index % 5) * 0.1;

    return {
      date: date.toISOString().slice(0, 10),
      amounts: {
        green: Math.round(pattern.green * variance),
        yellow: Math.round(pattern.yellow * variance),
        grey: Math.round(pattern.grey * variance),
      },
    };
  });
}

export const MOCK_OVERVIEW: OverviewResponse = {
  balance: 738_474.5,
  income: 9_135_189,
  expenses: 8_396_715,
  dailyBreakdown: createDailyBreakdown(),
  averages: {
    daily: 270_862,
    weekly: 1_896_032,
    monthly: 8_396_715,
  },
  categoryBreakdown: [
    {
      categoryId: "non-limit",
      name: "Non-limit",
      icon: "globe",
      color: "#fbbf24",
      amount: 2_767_781,
      percentage: 33,
    },
    {
      categoryId: "kebutuhan-kos",
      name: "Kebutuhan kos",
      icon: "home",
      color: "#84cc16",
      amount: 1_979_000,
      percentage: 24,
    },
    {
      categoryId: "obligatory",
      name: "Obligatory",
      icon: "heart-pulse",
      color: "#4ade80",
      amount: 1_621_138,
      percentage: 19,
    },
    {
      categoryId: "other-misc",
      name: "Other",
      icon: "ellipsis",
      color: "#9ca3af",
      amount: 1_065_286,
      percentage: 13,
    },
    {
      categoryId: "charity",
      name: "Charity",
      icon: "hand-coins",
      color: "#60a5fa",
      amount: 213_227,
      percentage: 3,
    },
    {
      categoryId: "health",
      name: "Health",
      icon: "heart-pulse",
      color: "#4ade80",
      amount: 336_285,
      percentage: 4,
    },
    {
      categoryId: "other-expense",
      name: "Other",
      icon: "camera",
      color: "#f472b6",
      amount: 396_238,
      percentage: 5,
    },
    {
      categoryId: "self-improvement",
      name: "Self Improve...",
      icon: "sparkles",
      color: "#fbbf24",
      amount: 17_760,
      percentage: 0,
    },
  ],
  budgetRemaining: 289_653,
  notificationCount: 8,
};
