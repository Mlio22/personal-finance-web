"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Delete } from "lucide-react";
import {
  appendDecimal,
  appendDigit,
  backspace,
  createAmountExpression,
  equals,
  evaluateExpression,
  formatAmountDisplay,
  setOperator,
  signedAmount,
  type AmountExpressionState,
  type AmountOperator,
  type AmountSignMode,
} from "@/components/amount-input/amount-expression";
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

type KeyAction =
  | { kind: "digit"; value: string; label: string }
  | { kind: "operator"; value: AmountOperator; label: string }
  | { kind: "decimal"; label: string }
  | { kind: "backspace"; label: string };

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

  const displayValue = useMemo(() => {
    const evaluated = evaluateExpression(expression);
    return formatAmountDisplay(evaluated, currency);
  }, [expression, currency]);

  function applyAction(action: KeyAction) {
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

  function handleConfirm() {
    const evaluated = evaluateExpression(equals(expression));
    onConfirm(signedAmount(evaluated, mode));
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-lg gap-0 rounded-t-[1.75rem] border-0 bg-[#1c1c1e] px-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] [&>div:first-child]:mt-3 [&>div:first-child]:h-1 [&>div:first-child]:w-10 [&>div:first-child]:bg-[#3a3a3c]">
        <div className="px-5 pb-4 pt-5 text-center">
          <DrawerTitle className="text-[0.9375rem] font-medium text-positive">
            {title}
          </DrawerTitle>
          <p className="mt-3 text-[1.75rem] font-semibold tabular-nums tracking-tight text-positive">
            {displayValue}
          </p>
        </div>

        {showSignModes ? (
          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
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

        <div
          className="grid grid-cols-5 grid-rows-4 gap-px border-t border-[#2a2a2a] bg-[#2a2a2a]"
          role="group"
          aria-label="Amount keypad"
        >
          <KeypadButton
            action={{ kind: "operator", value: "÷", label: "÷" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "7", label: "7" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "8", label: "8" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "9", label: "9" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "backspace", label: "Backspace" }}
            onPress={applyAction}
          />

          <KeypadButton
            action={{ kind: "operator", value: "×", label: "×" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "4", label: "4" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "5", label: "5" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "6", label: "6" }}
            onPress={applyAction}
          />

          <button
            type="button"
            aria-label="Confirm amount"
            onClick={handleConfirm}
            className="row-span-3 flex items-center justify-center bg-[#e11d48] text-white transition-colors hover:bg-[#be123c] active:bg-[#9f1239]"
          >
            <Check className="size-7" strokeWidth={2.25} aria-hidden="true" />
          </button>

          <KeypadButton
            action={{ kind: "operator", value: "-", label: "-" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "1", label: "1" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "2", label: "2" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "3", label: "3" }}
            onPress={applyAction}
          />

          <KeypadButton
            action={{ kind: "operator", value: "+", label: "+" }}
            onPress={applyAction}
          />
          <KeypadButton
            action={{ kind: "digit", value: "0", label: "0" }}
            onPress={applyAction}
            className="col-span-2"
          />
          <KeypadButton
            action={{ kind: "decimal", label: "." }}
            onPress={applyAction}
          />
        </div>
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

function KeypadButton({
  action,
  onPress,
  className,
}: {
  action: KeyAction;
  onPress: (action: KeyAction) => void;
  className?: string;
}) {
  const isOperator = action.kind === "operator";
  const isBackspace = action.kind === "backspace";

  return (
    <button
      type="button"
      onClick={() => onPress(action)}
      aria-label={action.label}
      className={cn(
        "flex h-14 items-center justify-center bg-[#1c1c1e] text-[1.25rem] font-medium text-foreground transition-colors hover:bg-[#252528] active:bg-[#2c2c2e]",
        isOperator && "text-muted-foreground",
        className,
      )}
    >
      {isBackspace ? (
        <Delete className="size-5" strokeWidth={1.75} aria-hidden="true" />
      ) : (
        action.label
      )}
    </button>
  );
}
