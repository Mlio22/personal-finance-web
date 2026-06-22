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

interface CategoryIconProps {
  icon: string;
  color: string;
  className?: string;
}

export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[icon] ?? Ellipsis;

  return (
    <span
      className={className}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <Icon className="size-3.5 text-white" strokeWidth={2.25} />
    </span>
  );
}
