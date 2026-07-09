"use client";

import { useMemo, useState } from "react";
import { Check, CircleDollarSign, FileText, Wallet, X } from "lucide-react";
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
import { formatMoney } from "@/lib/format-currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const FORM_TYPE_OPTIONS: AccountType[] = [
  "regular",
  "debt",
  "savings",
  "investment",
];

interface AccountFormScreenProps {
  mode: AccountFormMode;
  initialValues: AccountFormValues;
  onClose: () => void;
  onSubmit: (values: AccountFormValues) => void;
  account?: Account;
}

export function AccountFormScreen({
  mode,
  initialValues,
  onClose,
  onSubmit,
}: AccountFormScreenProps) {
  const [values, setValues] = useState<AccountFormValues>(initialValues);
  const [typeOpen, setTypeOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [creditLimitOpen, setCreditLimitOpen] = useState(false);

  const title = mode === "edit" ? "Edit account" : "New account";
  const canSubmit = values.name.trim().length > 0;

  const balanceLabel = useMemo(
    () => formatMoney(values.balance, values.currency),
    [values.balance, values.currency],
  );
  const creditLimitLabel = useMemo(
    () => formatMoney(values.creditLimit, values.currency),
    [values.creditLimit, values.currency],
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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/95 px-3 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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

        <h1 className="flex-1 text-center text-base font-semibold text-foreground">
          {title}
        </h1>

        <Button
          type="button"
          size="sm"
          className="rounded-full bg-[#c4b5fd] px-4 font-semibold text-[#1e1b4b] hover:bg-[#c4b5fd]/90"
          disabled={!canSubmit}
          onClick={handleDone}
        >
          Done
        </Button>
      </header>

      <div className="flex flex-1 flex-col px-4 pb-8 pt-2">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="account-name"
              className="mb-1 block text-sm font-medium text-section"
            >
              Name
            </label>
            <Input
              id="account-name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Account name"
              className="h-10 border-0 bg-transparent px-0 text-lg font-medium shadow-none focus-visible:ring-0 dark:bg-transparent"
              autoFocus={mode === "create"}
            />
          </div>

          <AccountAvatar
            name={values.name || "Account"}
            color={values.color}
            icon={values.icon}
            className="mt-1"
          />
        </div>

        <section className="space-y-1">
          <h2 className="px-1 text-sm font-medium text-section">Account</h2>

          <FormRowButton
            icon={Wallet}
            label="Type"
            value={ACCOUNT_TYPE_LABELS[values.type] ?? values.type}
            onClick={() => setTypeOpen(true)}
          />

          <FormRowButton
            icon={CircleDollarSign}
            label="Account currency"
            value={getCurrencyLabel(values.currency)}
            onClick={() => setCurrencyOpen(true)}
          />

          <div className="flex items-start gap-3 px-1 py-3">
            <span
              className="mt-0.5 flex size-9 shrink-0 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <FileText className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <label
                htmlFor="account-description"
                className="block text-sm font-medium text-foreground"
              >
                Description
              </label>
              <Input
                id="account-description"
                value={values.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Optional"
                className="mt-1 h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
          </div>
        </section>

        <div className="my-4 border-t border-border/60" />

        <section className="space-y-1">
          <h2 className="px-1 text-sm font-medium text-section">Balance</h2>

          <FormValueRow
            label="Account balance"
            value={balanceLabel}
            onClick={() => setBalanceOpen(true)}
          />

          <FormValueRow
            label="Credit limit"
            value={creditLimitLabel}
            onClick={() => setCreditLimitOpen(true)}
          />

          <div className="flex items-center justify-between gap-3 px-1 py-3">
            <span className="text-sm font-medium text-foreground">
              Include in total balance
            </span>
            <Switch
              checked={values.includeInTotalBalance}
              onCheckedChange={(checked) =>
                updateField("includeInTotalBalance", checked)
              }
              className="data-checked:bg-[#818cf8]"
              aria-label="Include in total balance"
            />
          </div>
        </section>
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

      <AmountEditorDrawer
        open={balanceOpen}
        onOpenChange={setBalanceOpen}
        title="Account balance"
        currency={values.currency}
        value={values.balance}
        onSave={(amount) => updateField("balance", amount)}
      />

      <AmountEditorDrawer
        open={creditLimitOpen}
        onOpenChange={setCreditLimitOpen}
        title="Credit limit"
        currency={values.currency}
        value={values.creditLimit}
        onSave={(amount) => updateField("creditLimit", amount)}
      />
    </div>
  );
}

function FormRowButton({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-left transition-colors hover:bg-muted/40"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center text-muted-foreground"
        aria-hidden="true"
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm text-[#a5b4fc]">
          {value}
        </span>
      </span>
    </button>
  );
}

function FormValueRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-3 text-left transition-colors hover:bg-muted/40"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm tabular-nums text-muted-foreground">{value}</span>
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
      <DrawerContent className="px-4 pb-8">
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

function AmountEditorDrawer({
  open,
  onOpenChange,
  title,
  currency,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currency: string;
  value: number;
  onSave: (amount: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setDraft(String(value));
        }
        onOpenChange(nextOpen);
      }}
    >
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor={`amount-${title}`}
              className="mb-2 block text-sm text-muted-foreground"
            >
              Amount ({currency})
            </label>
            <Input
              id={`amount-${title}`}
              inputMode="decimal"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-11 text-lg tabular-nums"
            />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={() => {
              const parsed = Number(draft.replace(/,/g, ""));
              onSave(Number.isFinite(parsed) ? parsed : 0);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
