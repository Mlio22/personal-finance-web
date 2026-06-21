import {
  BarChart3,
  Gauge,
  LayoutList,
  PieChart,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type MainTabId =
  | "accounts"
  | "categories"
  | "transactions"
  | "budget"
  | "overview";

export interface MainTab {
  id: MainTabId;
  href: `/${MainTabId}`;
  label: string;
  icon: LucideIcon;
  actionIcon?: LucideIcon;
  actionLabel?: string;
}

export const MAIN_TABS: MainTab[] = [
  {
    id: "accounts",
    href: "/accounts",
    label: "Accounts",
    icon: Wallet,
    actionIcon: Plus,
    actionLabel: "Add account",
  },
  {
    id: "categories",
    href: "/categories",
    label: "Categories",
    icon: PieChart,
    actionIcon: Plus,
    actionLabel: "Add category",
  },
  {
    id: "transactions",
    href: "/transactions",
    label: "Transactions",
    icon: LayoutList,
    actionIcon: Search,
    actionLabel: "Search transactions",
  },
  {
    id: "budget",
    href: "/budget",
    label: "Budget",
    icon: Gauge,
    actionIcon: SlidersHorizontal,
    actionLabel: "Budget settings",
  },
  {
    id: "overview",
    href: "/overview",
    label: "Overview",
    icon: BarChart3,
    actionIcon: Settings,
    actionLabel: "Overview settings",
  },
];

export function getTabByPathname(pathname: string): MainTab | undefined {
  return MAIN_TABS.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`));
}
