import type { CSSProperties } from "react";
import {
  CATEGORY_EDGE_SLOT_CLASS,
  CATEGORY_FLANK_SLOT_CLASS,
} from "@/features/categories/lib/category-grid-layout";
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
        density === "edge" ? CATEGORY_EDGE_SLOT_CLASS : CATEGORY_FLANK_SLOT_CLASS,
        className,
      )}
      style={style}
    />
  );
}
