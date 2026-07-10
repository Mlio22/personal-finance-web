"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  Check,
  CircleDollarSign,
  FileText,
  HandCoins,
  Trash2,
  Vault,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import type {
  Account,
  AccountFormMode,
  AccountFormValues,
  AccountType,
} from "@/features/accounts/types";
import {
  ACCOUNT_CURRENCIES,
  ACCOUNT_TYPE_LABELS,
  getCurrencyLabel,
} from "@/features/accounts/lib/account-form-options";
import { AccountAvatar } from "@/features/accounts/components/account-avatar";
import { AccountIconPicker } from "@/features/accounts/components/account-icon-picker";
import { AmountInputModal } from "@/components/amount-input";
import { formatMoney } from "@/lib/format-currency";
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

const FORM_TYPE_OPTIONS: AccountType[] = ["regular", "debt", "savings"];

const TYPE_ROW_ICONS: Record<AccountType, LucideIcon> = {
  regular: Wallet,
  debt: HandCoins,
  savings: Vault,
  investment: Vault,
};

interface AccountFormScreenProps {
  mode: AccountFormMode;
  initialValues: AccountFormValues;
  onClose: () => void;
  onSubmit: (values: AccountFormValues) => void;
  onDelete?: () => void;
  account?: Account;
}

export function AccountFormScreen({
  mode,
  initialValues,
  onClose,
  onSubmit,
  onDelete,
}: AccountFormScreenProps) {
  const [values, setValues] = useState<AccountFormValues>(initialValues);
  const [typeOpen, setTypeOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [secondaryAmountOpen, setSecondaryAmountOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const title = mode === "edit" ? "Edit account" : "New account";
  const canSubmit = values.name.trim().length > 0;
  const isSavingsLike = values.type === "savings";
  const secondaryLabel = isSavingsLike ? "Goal" : "Credit limit";
  const secondaryValue = isSavingsLike
    ? values.savingsTarget
    : values.creditLimit;
  const TypeIcon = TYPE_ROW_ICONS[values.type] ?? Wallet;

  const balanceLabel = useMemo(
    () => formatMoney(values.balance, values.currency),
    [values.balance, values.currency],
  );
  const secondaryAmountLabel = useMemo(
    () => formatMoney(secondaryValue, values.currency),
    [secondaryValue, values.currency],
  );

  function updateField<K extends keyof AccountFormValues>(
    key: K,
    value: AccountFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleDone() {
    if (!canSubmit) return;
    onSubmit(values);
  }

  function handleDelete() {
    if (!onDelete) return;
    const confirmed = window.confirm(
      "Delete this account? This cannot be undone.",
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
          aria-label="Close"
          onClick={onClose}
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </Button>

        <h1 className="flex-1 text-center text-[1.0625rem] font-semibold text-foreground">
          {title}
        </h1>

        <Button
          type="button"
          size="sm"
          className="rounded-full bg-[#c4b5fd] px-4 font-semibold text-[#1e1b4b] hover:bg-[#c4b5fd]/90 disabled:opacity-40"
          disabled={!canSubmit}
          onClick={handleDone}
        >
          Done
        </Button>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-10 pt-3">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="account-name"
              className="mb-1.5 block text-[0.8125rem] font-medium text-muted-foreground"
            >
              Name
            </label>
            <input
              id="account-name"
              type="text"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Account name"
              className="w-full min-h-[2rem] border-0 bg-transparent px-0 py-1 text-left text-[1.375rem] font-medium leading-tight text-foreground caret-foreground outline-none placeholder:text-muted-foreground"
              autoFocus={mode === "create"}
            />
          </div>

          <button
            type="button"
            aria-label="Change account icon"
            onClick={() => setIconPickerOpen(true)}
            className="mt-1 shrink-0 rounded-xl transition-opacity hover:opacity-90 active:opacity-80"
          >
            <AccountAvatar
              name={values.name || "Account"}
              color={values.color}
              icon={values.icon}
              size="md"
            />
          </button>
        </div>

        <section>
          <h2 className="mb-1 text-[0.9375rem] font-medium text-[#a5b4fc]">
            Account
          </h2>

          <FormMetaRow
            icon={TypeIcon}
            label="Type"
            value={ACCOUNT_TYPE_LABELS[values.type] ?? values.type}
            valueClassName="text-[#a5b4fc]"
            onClick={() => setTypeOpen(true)}
          />

          <FormMetaRow
            icon={CircleDollarSign}
            label="Account currency"
            value={getCurrencyLabel(values.currency)}
            valueClassName="text-muted-foreground"
            onClick={() => setCurrencyOpen(true)}
          />

          <div className="flex items-start gap-3.5 py-3.5">
            <span
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <FileText className="size-5" strokeWidth={1.6} />
            </span>
            <div className="min-w-0 flex-1">
              <label
                htmlFor="account-description"
                className="block text-[0.9375rem] font-medium text-foreground"
              >
                Description
              </label>
              <input
                id="account-description"
                type="text"
                value={values.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Optional"
                className="mt-1 w-full min-h-[1.75rem] border-0 bg-transparent px-0 py-1 text-left text-[0.9375rem] text-foreground caret-foreground outline-none placeholder:text-muted-foreground"
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        <div className="my-2 border-t border-border/50" />

        <section className="pt-3">
          <h2 className="mb-1 text-[0.9375rem] font-medium text-[#a5b4fc]">
            Balance
          </h2>

          <FormAmountRow
            label="Account balance"
            value={balanceLabel}
            emphasize={values.balance !== 0}
            onClick={() => setBalanceOpen(true)}
          />

          <FormAmountRow
            label={secondaryLabel}
            value={secondaryAmountLabel}
            emphasize={secondaryValue !== 0}
            onClick={() => setSecondaryAmountOpen(true)}
          />

          <div className="flex items-center justify-between gap-3 py-3.5">
            <span className="text-[0.9375rem] font-medium text-foreground">
              Include in total balance
            </span>
            <Switch
              checked={values.includeInTotalBalance}
              onCheckedChange={(checked) =>
                updateField("includeInTotalBalance", checked)
              }
              className="data-checked:bg-[#6366f1] data-unchecked:bg-[#3a3a3c]"
              aria-label="Include in total balance"
            />
          </div>
        </section>

        {mode === "edit" ? (
          <>
            <div className="my-2 border-t border-border/50" />

            <section className="pt-1">
              <div className="flex items-center justify-between gap-3 py-3.5">
                <span className="flex items-center gap-3.5">
                  <Archive
                    className="size-5 text-muted-foreground"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <span className="text-[0.9375rem] font-medium text-foreground">
                    Archive account
                  </span>
                </span>
                <Switch
                  checked={values.archived}
                  onCheckedChange={(checked) =>
                    updateField("archived", checked)
                  }
                  className="data-checked:bg-[#6366f1] data-unchecked:bg-[#3a3a3c]"
                  aria-label="Archive account"
                />
              </div>

              <div className="border-t border-border/50" />

              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-3.5 py-3.5 text-left transition-opacity hover:opacity-80"
              >
                <Trash2
                  className="size-5 text-[#f87171]"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <span className="text-[0.9375rem] font-medium text-[#f87171]">
                  Delete account
                </span>
              </button>
            </section>
          </>
        ) : null}
      </div>

      <OptionPickerDrawer
        open={typeOpen}
        onOpenChange={setTypeOpen}
        title="Type"
        options={FORM_TYPE_OPTIONS.map((type) => ({
          id: type,
          label: ACCOUNT_TYPE_LABELS[type] ?? type,
        }))}
        selectedId={values.type}
        onSelect={(id) => updateField("type", id as AccountType)}
      />

      <OptionPickerDrawer
        open={currencyOpen}
        onOpenChange={setCurrencyOpen}
        title="Account currency"
        options={ACCOUNT_CURRENCIES.map((currency) => ({
          id: currency.code,
          label: currency.label,
        }))}
        selectedId={values.currency}
        onSelect={(id) => updateField("currency", id)}
      />

      <AmountInputModal
        open={balanceOpen}
        onOpenChange={setBalanceOpen}
        title="Account balance"
        currency={values.currency}
        value={values.balance}
        onConfirm={(amount) => updateField("balance", amount)}
      />

      <AmountInputModal
        open={secondaryAmountOpen}
        onOpenChange={setSecondaryAmountOpen}
        title={secondaryLabel}
        currency={values.currency}
        value={secondaryValue}
        onConfirm={(amount) =>
          updateField(isSavingsLike ? "savingsTarget" : "creditLimit", amount)
        }
        showSignModes={!isSavingsLike}
      />

      <AccountIconPicker
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        icon={values.icon}
        color={values.color}
        onSave={({ icon, color }) => {
          setValues((current) => ({ ...current, icon, color }));
        }}
      />
    </div>
  );
}

function FormMetaRow({
  icon: Icon,
  label,
  value,
  valueClassName,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 py-3.5 text-left transition-opacity hover:opacity-90"
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center text-muted-foreground"
        aria-hidden="true"
      >
        <Icon className="size-5" strokeWidth={1.6} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.8125rem] font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "mt-0.5 block truncate text-[0.9375rem] font-medium",
            valueClassName,
          )}
        >
          {value}
        </span>
      </span>
    </button>
  );
}

function FormAmountRow({
  label,
  value,
  emphasize,
  onClick,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 py-3.5 text-left transition-opacity hover:opacity-90"
    >
      <span className="text-[0.9375rem] font-medium text-foreground">
        {label}
      </span>
      <span
        className={cn(
          "text-[0.9375rem] tabular-nums",
          emphasize ? "font-medium text-positive" : "text-muted-foreground",
        )}
      >
        {value}
      </span>
    </button>
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
