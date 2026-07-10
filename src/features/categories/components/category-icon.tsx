import {
  Camera,
  CircleDollarSign,
  Ellipsis,
  Gamepad2,
  Globe,
  HandCoins,
  HeartPulse,
  Home,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
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
};

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
