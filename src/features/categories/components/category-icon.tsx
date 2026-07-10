import {
  Apple,
  Camera,
  Candy,
  CircleDollarSign,
  CupSoda,
  Ellipsis,
  Gamepad2,
  Globe,
  HandCoins,
  HeartPulse,
  Home,
  Music,
  Receipt,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Utensils,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  "gamepad-2": Gamepad2,
  home: Home,
  camera: Camera,
  "hand-coins": HandCoins,
  globe: Globe,
  "circle-dollar-sign": CircleDollarSign,
  sparkles: Sparkles,
  zap: Zap,
  ellipsis: Ellipsis,
  "shopping-cart": ShoppingCart,
  "shopping-basket": ShoppingBasket,
  utensils: Utensils,
  apple: Apple,
  "cup-soda": CupSoda,
  candy: Candy,
  wine: Wine,
  music: Music,
  receipt: Receipt,
};

export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICONS);

export const CATEGORY_ICON_COLORS = [
  "#4ade80",
  "#a855f7",
  "#84cc16",
  "#f472b6",
  "#60a5fa",
  "#fbbf24",
  "#ef4444",
  "#b91c1c",
  "#9ca3af",
  "#14b8a6",
  "#f97316",
  "#a16207",
  "#c4b5fd",
  "#22d3ee",
] as const;

interface CategoryIconGlyphProps {
  icon: string;
  className?: string;
}

export function CategoryIconGlyph({ icon, className }: CategoryIconGlyphProps) {
  const Icon = CATEGORY_ICONS[icon] ?? Ellipsis;

  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}

interface CategoryIconProps {
  icon: string;
  color: string;
  className?: string;
}

export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full",
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <CategoryIconGlyph icon={icon} className="size-5 text-white" />
    </span>
  );
}
