"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Delete } from "lucide-react";
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

const LONG_PRESS_MS = 450;

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

  function handleEqualsOrConfirm() {
    if (pendingOperation) {
      setExpression((current) => equals(current));
      return;
    }

    const evaluated = evaluateExpression(expression) ?? 0;
    onConfirm(signedAmount(evaluated, mode));
    onOpenChange(false);
  }

  function handleClear() {
    setExpression(clearExpression());
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

        <div
          className="grid grid-cols-5 grid-rows-[repeat(4,minmax(3.75rem,1fr))] gap-px border-t border-[#2a2a2a] bg-[#2a2a2a]"
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
          <BackspaceButton onBackspace={() => applyAction({ kind: "backspace", label: "Backspace" })} onClear={handleClear} />

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
            aria-label={pendingOperation ? "Equals" : "Confirm amount"}
            onClick={handleEqualsOrConfirm}
            className="row-span-3 flex min-h-[11.25rem] items-center justify-center bg-[#e11d48] text-white transition-colors hover:bg-[#be123c] active:bg-[#9f1239]"
          >
            {pendingOperation ? (
              <span className="text-[1.75rem] font-medium" aria-hidden="true">
                =
              </span>
            ) : (
              <Check className="size-7" strokeWidth={2.25} aria-hidden="true" />
            )}
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
  action: Exclude<KeyAction, { kind: "backspace" }>;
  onPress: (action: KeyAction) => void;
  className?: string;
}) {
  const isOperator = action.kind === "operator";

  return (
    <button
      type="button"
      onClick={() => onPress(action)}
      aria-label={action.label}
      className={cn(
        "flex h-full min-h-[3.75rem] items-center justify-center bg-[#1c1c1e] text-[1.35rem] font-medium text-foreground transition-colors hover:bg-[#252528] active:bg-[#2c2c2e]",
        isOperator && "text-muted-foreground",
        className,
      )}
    >
      {action.label}
    </button>
  );
}

function BackspaceButton({
  onBackspace,
  onClear,
}: {
  onBackspace: () => void;
  onClear: () => void;
}) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  function clearTimer() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handlePointerDown() {
    didLongPress.current = false;
    clearTimer();
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onClear();
    }, LONG_PRESS_MS);
  }

  function handlePointerUp() {
    clearTimer();
  }

  function handleClick() {
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }
    onBackspace();
  }

  return (
    <button
      type="button"
      aria-label="Backspace. Hold to clear."
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="flex h-full min-h-[3.75rem] items-center justify-center bg-[#1c1c1e] text-foreground transition-colors hover:bg-[#252528] active:bg-[#2c2c2e]"
    >
      <Delete className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
