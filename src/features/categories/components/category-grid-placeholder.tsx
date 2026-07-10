import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type CategoryGridPlaceholderDensity = "edge" | "flank";

interface CategoryGridPlaceholderProps {
  density?: CategoryGridPlaceholderDensity;
  className?: string;
  style?: CSSProperties;
}

export function CategoryGridPlaceholder({
  density = "flank",
  className,
  style,
}: CategoryGridPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none invisible",
        density === "edge" ? "h-24" : "h-28",
        className,
      )}
      style={style}
    />
  );
}
