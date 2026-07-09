import {
  BarChart3,
  ChartLine,
  CircleDollarSign,
  HandCoins,
  Landmark,
  Plane,
  Sparkles,
  Vault,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { AccountIconKind } from "@/features/accounts/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<AccountIconKind, LucideIcon> = {
  wallet: Wallet,
  card: Landmark,
  cash: HandCoins,
  sparkle: Sparkles,
  vault: Vault,
  chart: ChartLine,
  bars: BarChart3,
  dollar: CircleDollarSign,
  gold: CircleDollarSign,
  sos: Sparkles,
  travel: Plane,
  qurban: HandCoins,
};

interface AccountAvatarProps {
  name: string;
  color?: string;
  icon?: AccountIconKind;
  showStar?: boolean;
  className?: string;
}

export function AccountAvatar({
  name,
  color,
  icon,
  showStar = false,
  className,
}: AccountAvatarProps) {
  const Icon = icon ? ICON_MAP[icon] : Wallet;

  return (
    <span className={cn("relative shrink-0", className)}>
      <span
        className="flex size-10 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: color ?? "#6b7280" }}
        aria-hidden="true"
      >
        {icon === "sos" ? (
          <span className="text-[0.65rem] font-bold tracking-wide">SOS</span>
        ) : (
          <Icon className="size-5" strokeWidth={1.75} />
        )}
      </span>

      {showStar ? (
        <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-background">
          <span className="flex size-3 items-center justify-center rounded-full bg-yellow-400 text-[0.45rem] font-bold text-black">
            ★
          </span>
        </span>
      ) : null}

      <span className="sr-only">{name}</span>
    </span>
  );
}
