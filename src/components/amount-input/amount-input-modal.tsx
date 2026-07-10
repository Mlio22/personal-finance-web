"use client";

import { useEffect, useMemo, useState } from "react";
import {
  appendDecimal,
  appendDigit,
  backspace,
  clearExpression,
  createAmountExpression,
  equals,
  evaluateExpression,
  formatExpressionDisplay,
  hasPendingOperation,
  setOperator,
  signedAmount,
  type AmountExpressionState,
  type AmountSignMode,
} from "@/components/amount-input/amount-expression";
import {
  AmountKeypad,
  type AmountKeypadAction,
} from "@/components/amount-input/amount-keypad";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface AmountInputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currency?: string;
  value: number;
  onConfirm: (amount: number) => void;
  /** Show CREDIT / BALANCE mode toggle. Defaults to true. */
  showSignModes?: boolean;
  /** Initial sign mode derived from value when opening. */
  defaultMode?: AmountSignMode;
}

export function AmountInputModal({
  open,
  onOpenChange,
  title,
  currency = "IDR",
  value,
  onConfirm,
  showSignModes = true,
  defaultMode,
}: AmountInputModalProps) {
  const [expression, setExpression] = useState<AmountExpressionState>(() =>
    createAmountExpression(value),
  );
  const [mode, setMode] = useState<AmountSignMode>(
    defaultMode ?? (value < 0 ? "credit" : "balance"),
  );

  useEffect(() => {
    if (!open) return;
    setExpression(createAmountExpression(value));
    setMode(defaultMode ?? (value < 0 ? "credit" : "balance"));
  }, [open, value, defaultMode]);

  const displayValue = useMemo(
    () => formatExpressionDisplay(expression, currency),
    [expression, currency],
  );

  const accentClass =
    showSignModes && mode === "credit" ? "text-expense" : "text-positive";

  const pendingOperation = hasPendingOperation(expression);

  function applyAction(action: AmountKeypadAction) {
    setExpression((current) => {
      switch (action.kind) {
        case "digit":
          return appendDigit(current, action.value);
        case "decimal":
          return appendDecimal(current);
        case "backspace":
          return backspace(current);
        case "operator":
          return setOperator(current, action.value);
      }
    });
  }

  function handleEqualsOrConfirm() {
    if (pendingOperation) {
      setExpression((current) => equals(current));
      return;
    }

    const evaluated = evaluateExpression(expression) ?? 0;
    onConfirm(signedAmount(evaluated, mode));
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-lg gap-0 rounded-t-[1.75rem] border-0 bg-[#1c1c1e] px-0 pb-[env(safe-area-inset-bottom)] [&>div:first-child]:mt-2.5 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[#3a3a3c]">
        <div className="px-5 pb-3 pt-4 text-center">
          <DrawerTitle
            className={cn("text-[0.9375rem] font-medium", accentClass)}
          >
            {title}
          </DrawerTitle>
          <p
            className={cn(
              "mt-2 min-h-[2.5rem] text-[1.75rem] font-semibold tabular-nums tracking-tight",
              accentClass,
            )}
          >
            {displayValue}
          </p>
        </div>

        {showSignModes ? (
          <div className="grid grid-cols-2 gap-3 px-4 pb-3">
            <ModeButton
              label="CREDIT"
              active={mode === "credit"}
              onClick={() => setMode("credit")}
            />
            <ModeButton
              label="BALANCE"
              active={mode === "balance"}
              onClick={() => setMode("balance")}
            />
          </div>
        ) : null}

        <AmountKeypad
          pendingOperation={pendingOperation}
          onAction={applyAction}
          onConfirm={handleEqualsOrConfirm}
          onClear={() => setExpression(clearExpression())}
        />
      </DrawerContent>
    </Drawer>
  );
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-colors",
        active
          ? "bg-positive text-[#042f2e]"
          : "bg-[#2c2c2e] text-foreground hover:bg-[#3a3a3c]",
      )}
    >
      {label}
    </button>
  );
}
