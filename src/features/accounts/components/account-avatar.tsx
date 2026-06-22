import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountAvatarProps {
  name: string;
  color?: string;
  showStar?: boolean;
  className?: string;
}

export function AccountAvatar({
  name,
  color,
  showStar = false,
  className,
}: AccountAvatarProps) {
  return (
    <span className={cn("relative shrink-0", className)}>
      <span
        className="flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: color ?? "#6b7280" }}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
      </span>

      {showStar ? (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-background">
          <Star
            className="size-3 fill-yellow-400 text-yellow-400"
            aria-hidden="true"
          />
        </span>
      ) : null}
    </span>
  );
}
