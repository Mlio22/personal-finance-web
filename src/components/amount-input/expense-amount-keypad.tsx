"use client";

import { Calendar } from "lucide-react";
import {
  AmountKeypad,
  type AmountKeypadProps,
} from "@/components/amount-input/amount-keypad";
import { cn } from "@/lib/utils";

export interface ExpenseAmountKeypadProps extends AmountKeypadProps {
  currency: string;
  onCalendarPress: () => void;
  onCurrencyPress: () => void;
}

const actionButtonClassName =
  "flex h-full min-h-[3.75rem] items-center justify-center rounded-xl border border-[#3a3a3c] bg-[#1c1c1e] text-foreground transition-colors hover:bg-[#252528] active:bg-[#2c2c2e]";

export function ExpenseAmountKeypad({
  currency,
  onCalendarPress,
  onCurrencyPress,
  ...keypadProps
}: ExpenseAmountKeypadProps) {
  return (
    <AmountKeypad
      {...keypadProps}
      leadingActions={[
        <button
          key="calendar"
          type="button"
          aria-label="Transaction date"
          onClick={onCalendarPress}
          className={actionButtonClassName}
        >
          <Calendar className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>,
        <button
          key="currency"
          type="button"
          aria-label="Transaction currency"
          onClick={onCurrencyPress}
          className={cn(actionButtonClassName, "text-sm font-semibold tracking-wide")}
        >
          {currency}
        </button>,
      ]}
    />
  );
}
