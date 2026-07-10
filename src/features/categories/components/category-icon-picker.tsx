"use client";

import { useEffect, useState } from "react";
import { Palette, Star, X } from "lucide-react";
import {
  CATEGORY_ICON_COLORS,
  CATEGORY_ICON_OPTIONS,
  CategoryIcon,
  CategoryIconGlyph,
} from "@/features/categories/components/category-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryIconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: string;
  color: string;
  onSave: (next: { icon: string; color: string }) => void;
}

type PickerTab = "icon" | "color";

export function CategoryIconPicker({
  open,
  onOpenChange,
  icon,
  color,
  onSave,
}: CategoryIconPickerProps) {
  const [tab, setTab] = useState<PickerTab>("icon");
  const [draftIcon, setDraftIcon] = useState(icon);
  const [draftColor, setDraftColor] = useState(color);

  useEffect(() => {
    if (!open) return;
    setDraftIcon(icon);
    setDraftColor(color);
    setTab("icon");
  }, [open, icon, color]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-center bg-background">
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
            Category icon
          </h1>

          <Button
            type="button"
            size="sm"
            className="rounded-full bg-[#c4b5fd] px-4 font-semibold text-[#1e1b4b] hover:bg-[#c4b5fd]/90"
            onClick={() => {
              onSave({ icon: draftIcon, color: draftColor });
              onOpenChange(false);
            }}
          >
            Done
          </Button>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-8">
          <div className="flex justify-center py-6">
            <CategoryIcon
              icon={draftIcon}
              color={draftColor}
              className="size-20 rounded-2xl"
            />
          </div>

          <div className="mb-6 flex justify-center gap-10 border-b border-border/50">
            <TabButton
              active={tab === "icon"}
              label="Icon"
              icon={Star}
              onClick={() => setTab("icon")}
            />
            <TabButton
              active={tab === "color"}
              label="Color"
              icon={Palette}
              onClick={() => setTab("color")}
            />
          </div>

          {tab === "icon" ? (
            <div className="grid grid-cols-5 gap-3 px-1">
              {CATEGORY_ICON_OPTIONS.map((option) => {
                const selected = draftIcon === option;

                return (
                  <button
                    key={option}
                    type="button"
                    aria-label={`Select ${option} icon`}
                    aria-pressed={selected}
                    onClick={() => setDraftIcon(option)}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-full transition-colors",
                      selected
                        ? "bg-[#c4b5fd] text-[#1e1b4b]"
                        : "text-foreground hover:bg-muted/60",
                    )}
                  >
                    <CategoryIconGlyph icon={option} className="size-6" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3 px-1">
              {CATEGORY_ICON_COLORS.map((swatch) => {
                const selected = draftColor === swatch;

                return (
                  <button
                    key={swatch}
                    type="button"
                    aria-label={`Select color ${swatch}`}
                    aria-pressed={selected}
                    onClick={() => setDraftColor(swatch)}
                    className={cn(
                      "aspect-square rounded-full border-2 transition-transform",
                      selected
                        ? "scale-110 border-white"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: swatch }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: typeof Star;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1 pb-3 text-xs font-medium",
        active ? "text-[#c4b5fd]" : "text-muted-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span>{label}</span>
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#7c3aed]" />
      ) : null}
    </button>
  );
}
