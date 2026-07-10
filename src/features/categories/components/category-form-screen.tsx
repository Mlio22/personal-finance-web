"use client";

import { useState } from "react";
import {
  Archive,
  ArrowLeft,
  Check,
  CircleDollarSign,
  MoreVertical,
  Plus,
  X,
} from "lucide-react";
import {
  CategoryIcon,
  CategoryIconGlyph,
} from "@/features/categories/components/category-icon";
import { CategoryIconPicker } from "@/features/categories/components/category-icon-picker";
import { SubcategoryFormScreen } from "@/features/categories/components/subcategory-form-screen";
import { createSubcategoryId } from "@/features/categories/lib/categories-store";
import type {
  CategoryFormMode,
  CategoryFormValues,
  CategorySubcategoryFormValue,
} from "@/features/categories/types";
import {
  ACCOUNT_CURRENCIES,
  getCurrencyLabel,
} from "@/features/accounts/lib/account-form-options";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface CategoryFormScreenProps {
  mode: CategoryFormMode;
  initialValues: CategoryFormValues;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  onDelete?: () => void;
}

export function CategoryFormScreen({
  mode,
  initialValues,
  onClose,
  onSubmit,
  onDelete,
}: CategoryFormScreenProps) {
  const [values, setValues] = useState<CategoryFormValues>(initialValues);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<CategorySubcategoryFormValue | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const canSubmit = values.name.trim().length > 0;
  const isCreate = mode === "create";

  function updateField<K extends keyof CategoryFormValues>(
    key: K,
    value: CategoryFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleDone() {
    if (!canSubmit) return;
    onSubmit(values);
  }

  function handleSaveSubcategory(next: { name: string; icon: string }) {
    if (editingSubcategory) {
      updateField(
        "subcategories",
        values.subcategories.map((item) =>
          item.id === editingSubcategory.id
            ? { ...item, name: next.name, icon: next.icon }
            : item,
        ),
      );
      setEditingSubcategory(null);
      return;
    }

    updateField("subcategories", [
      ...values.subcategories,
      {
        id: createSubcategoryId(next.name),
        name: next.name,
        icon: next.icon,
      },
    ]);
  }

  function handleDelete() {
    if (!onDelete) return;
    const confirmed = window.confirm(
      "Delete this category? This cannot be undone.",
    );
    if (confirmed) {
      onDelete();
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/95 px-2 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={isCreate ? "Close" : "Back"}
          onClick={onClose}
        >
          {isCreate ? (
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
          )}
        </Button>

        <h1 className="flex-1 text-center text-[1.0625rem] font-semibold text-foreground">
          {isCreate ? "New category" : "Category"}
        </h1>

        {isCreate ? (
          <Button
            type="button"
            size="sm"
            className="rounded-full bg-[#c4b5fd] px-4 font-semibold text-[#1e1b4b] hover:bg-[#c4b5fd]/90 disabled:opacity-40"
            disabled={!canSubmit}
            onClick={handleDone}
          >
            Done
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="More options"
            onClick={() => setMenuOpen(true)}
          >
            <MoreVertical className="size-5" strokeWidth={1.75} />
          </Button>
        )}
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-10 pt-4">
        <div className="mb-8 flex items-center gap-4 border-b border-border/40 pb-5">
          <div className="min-w-0 flex-1">
            {isCreate ? null : (
              <p className="mb-1 text-[0.8125rem] font-medium text-muted-foreground">
                Name
              </p>
            )}
            <input
              id="category-name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Name"
              className={cn(
                "w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
                isCreate
                  ? "text-[1.0625rem] font-medium"
                  : "text-2xl font-semibold",
              )}
              autoFocus={isCreate}
            />
          </div>

          <button
            type="button"
            onClick={() => setIconPickerOpen(true)}
            className="shrink-0 overflow-hidden rounded-2xl"
            aria-label="Change category icon"
          >
            <CategoryIcon
              icon={values.icon}
              color={values.color}
              className="size-[3.25rem] !rounded-2xl"
            />
          </button>
        </div>

        <section className="mb-2">
          <h2 className="mb-1 text-sm font-medium text-[#c4b5fd]">Settings</h2>
          <button
            type="button"
            onClick={() => setCurrencyOpen(true)}
            className="flex w-full items-center gap-3.5 py-3.5 text-left transition-opacity hover:opacity-80"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/70">
              <CircleDollarSign
                className="size-5 text-foreground"
                strokeWidth={1.75}
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9375rem] font-medium">
                Category currency
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {getCurrencyLabel(values.currency)}
              </span>
            </span>
          </button>
        </section>

        <div className="mb-5 border-t border-border/50" />

        <section className="mb-8">
          <h2 className="mb-1 text-sm font-medium text-[#c4b5fd]">
            Subcategories
          </h2>

          <div>
            {values.subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                type="button"
                onClick={() => {
                  setEditingSubcategory(subcategory);
                  setSubcategoryOpen(true);
                }}
                className="flex w-full items-center gap-3.5 border-b border-border/30 py-3.5 text-left transition-opacity hover:opacity-80"
              >
                <CategoryIconGlyph
                  icon={subcategory.icon}
                  className="size-5 shrink-0 text-foreground"
                />
                <span className="min-w-0 flex-1 text-[0.9375rem] font-medium">
                  {subcategory.name}
                </span>
                <MoreVertical
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setEditingSubcategory(null);
                setSubcategoryOpen(true);
              }}
              className="flex w-full items-center gap-3.5 py-3.5 text-left text-[0.9375rem] font-medium transition-opacity hover:opacity-80"
            >
              <Plus
                className="size-5 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              Add subcategory
            </button>
          </div>
        </section>

        {!isCreate ? (
          <>
            <div className="mb-2 border-t border-border/50" />
            <div className="flex items-center gap-3.5 py-3.5">
              <Archive
                className="size-5 shrink-0 text-muted-foreground"
                strokeWidth={1.75}
              />
              <span className="flex-1 text-[0.9375rem] font-medium">
                Archive category
              </span>
              <Switch
                checked={values.archived}
                onCheckedChange={(checked) => updateField("archived", checked)}
                className="data-checked:bg-[#6366f1] data-unchecked:bg-[#3a3a3c]"
                aria-label="Archive category"
              />
            </div>
          </>
        ) : null}
      </div>

      <CategoryIconPicker
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        icon={values.icon}
        color={values.color}
        onSave={({ icon, color }) => {
          updateField("icon", icon);
          updateField("color", color);
        }}
      />

      <SubcategoryFormScreen
        open={subcategoryOpen}
        onOpenChange={setSubcategoryOpen}
        initialName={editingSubcategory?.name ?? ""}
        initialIcon={editingSubcategory?.icon ?? values.icon}
        accentColor={values.color}
        onSave={handleSaveSubcategory}
      />

      <OptionPickerDrawer
        open={currencyOpen}
        onOpenChange={setCurrencyOpen}
        title="Category currency"
        options={ACCOUNT_CURRENCIES.map((currency) => ({
          id: currency.code,
          label: currency.label,
        }))}
        selectedId={values.currency}
        onSelect={(id) => updateField("currency", id)}
      />

      <Drawer open={menuOpen} onOpenChange={setMenuOpen}>
        <DrawerContent className="mx-auto max-w-lg px-4 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle>Category options</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-1">
            <DrawerClose asChild>
              <button
                type="button"
                onClick={handleDone}
                className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-medium hover:bg-muted/60"
              >
                Save changes
              </button>
            </DrawerClose>
            {onDelete ? (
              <DrawerClose asChild>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center rounded-xl px-3 py-3 text-left text-sm font-medium text-[#f87171] hover:bg-muted/60"
                >
                  Delete category
                </button>
              </DrawerClose>
            ) : null}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function OptionPickerDrawer({
  open,
  onOpenChange,
  title,
  options,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-lg px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-1">
          {options.map((option) => (
            <DrawerClose key={option.id} asChild>
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/60",
                  selectedId === option.id && "bg-muted",
                )}
              >
                <span className="text-sm font-medium">{option.label}</span>
                {selectedId === option.id ? (
                  <Check
                    className="size-4 shrink-0 text-positive"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
