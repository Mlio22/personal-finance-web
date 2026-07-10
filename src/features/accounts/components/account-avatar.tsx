import {
  BarChart3,
  Briefcase,
  Calculator,
  ChartLine,
  CircleDollarSign,
  Coins,
  CreditCard,
  Gift,
  HandCoins,
  Landmark,
  PiggyBank,
  Plane,
  Sprout,
  Sparkles,
  Vault,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { AccountIconKind } from "@/features/accounts/types";
import { cn } from "@/lib/utils";

export const ACCOUNT_ICON_MAP: Record<AccountIconKind, LucideIcon> = {
  wallet: Wallet,
  card: Landmark,
  cash: HandCoins,
  sparkle: Sparkles,
  vault: Vault,
  chart: ChartLine,
  bars: BarChart3,
  dollar: CircleDollarSign,
  gold: Coins,
  sos: Sparkles,
  travel: Plane,
  qurban: HandCoins,
  piggy: PiggyBank,
  briefcase: Briefcase,
  bank: Landmark,
  coins: Coins,
  "credit-card": CreditCard,
  gift: Gift,
  calculator: Calculator,
  plant: Sprout,
  safe: Vault,
  hand: HandCoins,
};

export const ACCOUNT_ICON_OPTIONS: AccountIconKind[] = [
  "wallet",
  "card",
  "cash",
  "piggy",
  "briefcase",
  "bank",
  "vault",
  "safe",
  "coins",
  "gold",
  "dollar",
  "credit-card",
  "gift",
  "calculator",
  "chart",
  "bars",
  "sparkle",
  "plant",
  "travel",
  "hand",
  "sos",
  "qurban",
];

interface AccountAvatarProps {
  name: string;
  color?: string;
  icon?: AccountIconKind;
  showStar?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "size-10 rounded-xl",
  md: "size-11 rounded-xl",
  lg: "size-20 rounded-2xl",
} as const;

const ICON_SIZE_CLASSES = {
  sm: "size-5",
  md: "size-5",
  lg: "size-9",
} as const;

export function AccountAvatar({
  name,
  color,
  icon,
  showStar = false,
  size = "sm",
  className,
}: AccountAvatarProps) {
  const Icon = icon ? ACCOUNT_ICON_MAP[icon] : Wallet;

  return (
    <span className={cn("relative shrink-0", className)}>
      <span
        className={cn(
          "flex items-center justify-center text-white",
          SIZE_CLASSES[size],
        )}
        style={{ backgroundColor: color ?? "#6b7280" }}
        aria-hidden="true"
      >
        {icon === "sos" ? (
          <span
            className={cn(
              "font-bold tracking-wide",
              size === "lg" ? "text-sm" : "text-[0.65rem]",
            )}
          >
            SOS
          </span>
        ) : (
          <Icon className={ICON_SIZE_CLASSES[size]} strokeWidth={1.75} />
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
