"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import {
  CATEGORY_ICON_OPTIONS,
  CategoryIconGlyph,
} from "@/features/categories/components/category-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubcategoryFormScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  initialName?: string;
  initialIcon?: string;
  accentColor: string;
  onSave: (value: { name: string; icon: string }) => void;
}

export function SubcategoryFormScreen({
  open,
  onOpenChange,
  title = "Subcategory",
  initialName = "",
  initialIcon = "utensils",
  accentColor,
  onSave,
}: SubcategoryFormScreenProps) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setIcon(initialIcon);
  }, [open, initialName, initialIcon]);

  if (!open) {
    return null;
  }

  const canSubmit = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[70] flex justify-center bg-background">
      <div className="flex h-dvh w-full max-w-lg flex-col">
        <header className="flex items-center gap-2 px-3 py-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </Button>

          <h1 className="flex-1 text-center text-base font-semibold">
            {title}
          </h1>

          <Button
            type="button"
            size="sm"
            className="rounded-full bg-[#c4b5fd] px-4 font-semibold text-[#1e1b4b] hover:bg-[#c4b5fd]/90 disabled:opacity-40"
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              onSave({ name: name.trim(), icon });
              onOpenChange(false);
            }}
          >
            Done
          </Button>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex justify-center py-8">
            <span
              className="flex size-24 items-center justify-center rounded-full"
              style={{ backgroundColor: accentColor }}
            >
              <CategoryIconGlyph icon={icon} className="size-10 text-white" />
            </span>
          </div>

          <div className="px-5 pb-6">
            <label className="relative block rounded-xl border border-[#4a4a4c] px-3 pb-3 pt-4">
              <span className="absolute -top-2 left-3 bg-background px-1 text-xs text-muted-foreground">
                Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-transparent text-base text-foreground outline-none"
                placeholder="Subcategory name"
                autoFocus
              />
            </label>
          </div>

          <div className="flex-1 rounded-t-2xl bg-[#1c1c1e] px-4 pb-8 pt-3">
            <div className="mb-4 flex items-center gap-2 border-b border-[#7c3aed]/50 pb-2 text-sm font-medium text-[#c4b5fd]">
              <Star className="size-4" aria-hidden="true" />
              Icon
            </div>

            <div className="grid grid-cols-5 gap-3">
              {CATEGORY_ICON_OPTIONS.map((option) => {
                const selected = icon === option;

                return (
                  <button
                    key={option}
                    type="button"
                    aria-label={`Select ${option} icon`}
                    aria-pressed={selected}
                    onClick={() => setIcon(option)}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-full transition-colors",
                      selected
                        ? "bg-[#c4b5fd] text-[#1e1b4b]"
                        : "text-foreground hover:bg-[#2c2c2e]",
                    )}
                  >
                    <CategoryIconGlyph
                      icon={option}
                      className="size-6"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
