"use client";

import { useRef } from "react";
import { Calendar, Check, Delete } from "lucide-react";
import type { AmountOperator } from "@/components/amount-input/amount-expression";
import { cn } from "@/lib/utils";

export type AmountKeypadAction =
  | { kind: "digit"; value: string; label: string }
  | { kind: "operator"; value: AmountOperator; label: string }
  | { kind: "decimal"; label: string }
  | { kind: "backspace"; label: string };

const LONG_PRESS_MS = 450;

const KEY_CLASS =
  "flex h-full min-h-[3.75rem] items-center justify-center rounded-xl border border-[#3a3a3c] bg-[#1c1c1e] text-[1.35rem] font-medium text-foreground transition-colors hover:bg-[#252528] active:bg-[#2c2c2e]";

export interface ExpenseAmountKeypadProps {
  pendingOperation: boolean;
  onAction: (action: AmountKeypadAction) => void;
  onConfirm: () => void;
  onClear: () => void;
  currency: string;
  onCalendarPress: () => void;
  onCurrencyPress: () => void;
  confirmClassName?: string;
}

/**
 * Expense keypad layout (matches mockup):
 * ÷  7  8  9  ⌫
 * ×  4  5  6  📅
 * −  1  2  3  ✓
 * + IDR 0  .  ✓  (check spans rows 3–4)
 */
export function ExpenseAmountKeypad({
  pendingOperation,
  onAction,
  onConfirm,
  onClear,
  currency,
  onCalendarPress,
  onCurrencyPress,
  confirmClassName,
}: ExpenseAmountKeypadProps) {
  return (
    <div
      className="grid grid-cols-5 grid-rows-[repeat(4,minmax(3.75rem,1fr))] gap-2 border-t border-[#2a2a2a] bg-[#121212] p-2"
      role="group"
      aria-label="Amount keypad"
    >
      <KeypadButton
        action={{ kind: "operator", value: "÷", label: "÷" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "7", label: "7" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "8", label: "8" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "9", label: "9" }}
        onPress={onAction}
      />
      <BackspaceButton
        onBackspace={() => onAction({ kind: "backspace", label: "Backspace" })}
        onClear={onClear}
      />

      <KeypadButton
        action={{ kind: "operator", value: "×", label: "×" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "4", label: "4" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "5", label: "5" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "6", label: "6" }}
        onPress={onAction}
      />
      <button
        type="button"
        aria-label="Transaction date"
        onClick={onCalendarPress}
        className={KEY_CLASS}
      >
        <Calendar className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <KeypadButton
        action={{ kind: "operator", value: "-", label: "-" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "1", label: "1" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "2", label: "2" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "digit", value: "3", label: "3" }}
        onPress={onAction}
      />
      <button
        type="button"
        aria-label={pendingOperation ? "Equals" : "Confirm amount"}
        onClick={onConfirm}
        className={cn(
          "row-span-2 flex min-h-[7.5rem] items-center justify-center rounded-xl border border-[#3a3a3c] bg-[#7c3aed] text-white transition-colors hover:bg-[#6d28d9] active:bg-[#5b21b6]",
          confirmClassName,
        )}
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
        action={{ kind: "operator", value: "+", label: "+" }}
        onPress={onAction}
      />
      <button
        type="button"
        aria-label="Transaction currency"
        onClick={onCurrencyPress}
        className={cn(KEY_CLASS, "text-sm font-semibold tracking-wide")}
      >
        {currency}
      </button>
      <KeypadButton
        action={{ kind: "digit", value: "0", label: "0" }}
        onPress={onAction}
      />
      <KeypadButton
        action={{ kind: "decimal", label: "." }}
        onPress={onAction}
      />
    </div>
  );
}

function KeypadButton({
  action,
  onPress,
  className,
}: {
  action: Exclude<AmountKeypadAction, { kind: "backspace" }>;
  onPress: (action: AmountKeypadAction) => void;
  className?: string;
}) {
  const isOperator = action.kind === "operator";

  return (
    <button
      type="button"
      onClick={() => onPress(action)}
      aria-label={action.label}
      className={cn(KEY_CLASS, isOperator && "text-muted-foreground", className)}
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
      className={KEY_CLASS}
    >
      <Delete className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
