"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import type { CategoryKind } from "@/features/categories/types";
import { cn } from "@/lib/utils";

const TABS: Array<{
  id: CategoryKind;
  label: string;
  icon: typeof ArrowDown;
}> = [
  { id: "expense", label: "Expenses", icon: ArrowDown },
  { id: "income", label: "Income", icon: ArrowUp },
];

interface CategoriesKindTabsProps {
  activeKind: CategoryKind;
  onKindChange: (kind: CategoryKind) => void;
}

export function CategoriesKindTabs({
  activeKind,
  onKindChange,
}: CategoriesKindTabsProps) {
  return (
    <nav aria-label="Category kinds" className="border-b border-border/50">
      <div className="flex">
        {TABS.map((tab) => {
          const isActive = tab.id === activeKind;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onKindChange(tab.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1.5 pb-3 pt-1 text-[0.75rem] font-medium transition-colors",
                isActive
                  ? "text-[#c4b5fd]"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border",
                  isActive ? "border-[#7c3aed]/70" : "border-[#4a4a4c]",
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span>{tab.label}</span>
              {isActive ? (
                <span
                  className="absolute inset-x-6 -bottom-px h-0.5 rounded-full bg-[#7c3aed]"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
