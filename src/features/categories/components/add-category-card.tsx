"use client";

import type { CSSProperties } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddCategoryCardProps {
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
}

export function AddCategoryCard({
  onClick,
  className,
  style,
}: AddCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground",
        className,
      )}
      style={style}
      aria-label="Add category"
    >
      <span className="h-[10px]" aria-hidden="true" />
      <span className="h-[9px]" aria-hidden="true" />
      <span className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50">
        <Plus className="size-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="h-[9px]" aria-hidden="true" />
    </button>
  );
}
