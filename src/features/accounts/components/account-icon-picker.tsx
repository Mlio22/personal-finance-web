"use client";

import { useEffect, useState } from "react";
import { Palette, Star, X } from "lucide-react";
import type { AccountIconKind } from "@/features/accounts/types";
import {
  ACCOUNT_ICON_MAP,
  ACCOUNT_ICON_OPTIONS,
  AccountAvatar,
} from "@/features/accounts/components/account-avatar";
import { ACCOUNT_ICON_COLORS } from "@/features/accounts/lib/account-form-options";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccountIconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: AccountIconKind;
  color: string;
  onSave: (next: { icon: AccountIconKind; color: string }) => void;
}

type PickerTab = "icon" | "color";

export function AccountIconPicker({
  open,
  onOpenChange,
  icon,
  color,
  onSave,
}: AccountIconPickerProps) {
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

          <h1 className="flex-1 text-center text-base font-semibold text-foreground">
            Account icon
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
            <AccountAvatar
              name="Preview"
              icon={draftIcon}
              color={draftColor}
              size="lg"
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
              {ACCOUNT_ICON_OPTIONS.map((option) => {
                const Icon = ACCOUNT_ICON_MAP[option];
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
                        : "bg-muted text-foreground hover:bg-muted/80",
                    )}
                  >
                    {option === "sos" ? (
                      <span className="text-[0.65rem] font-bold tracking-wide">
                        SOS
                      </span>
                    ) : (
                      <Icon className="size-5" strokeWidth={1.75} />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3 px-1">
              {ACCOUNT_ICON_COLORS.map((swatch) => {
                const selected =
                  draftColor.toLowerCase() === swatch.toLowerCase();

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
                        ? "scale-105 border-white"
                        : "border-transparent hover:scale-105",
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
        "relative flex min-w-16 flex-col items-center gap-1 pb-3 text-xs font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
      <span>{label}</span>
      {active ? (
        <span
          className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#c4b5fd]"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}
