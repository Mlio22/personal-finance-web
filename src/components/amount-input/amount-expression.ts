export type AmountSignMode = "balance" | "credit";

export type AmountOperator = "+" | "-" | "×" | "÷";

export interface AmountExpressionState {
  /** Left-hand operand as typed digits (may include decimal). Empty means start. */
  left: string;
  operator: AmountOperator | null;
  /** Right-hand operand while an operator is active. */
  right: string;
  /** Whether the next digit should replace the current operand. */
  replaceNext: boolean;
}

export function createAmountExpression(
  initialValue = 0,
): AmountExpressionState {
  return {
    left: formatOperand(Math.abs(initialValue)),
    operator: null,
    right: "",
    replaceNext: true,
  };
}

export function clearExpression(): AmountExpressionState {
  return {
    left: "0",
    operator: null,
    right: "",
    replaceNext: true,
  };
}

function formatOperand(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (Number.isInteger(value)) return String(value);
  // Trim trailing zeros from decimal results without forcing fixed places.
  return String(parseFloat(value.toFixed(8)));
}

export function parseOperand(value: string): number {
  if (!value || value === "." || value === "-") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function applyOperator(
  left: number,
  operator: AmountOperator,
  right: number,
): number | null {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      if (right === 0) return null;
      return left / right;
  }
}

export function evaluateExpression(state: AmountExpressionState): number | null {
  const left = parseOperand(state.left);

  if (!state.operator) {
    return left;
  }

  if (state.right === "" || state.right === ".") {
    return left;
  }

  return applyOperator(left, state.operator, parseOperand(state.right));
}

function currentOperand(state: AmountExpressionState): string {
  return state.operator ? state.right : state.left;
}

function setCurrentOperand(
  state: AmountExpressionState,
  value: string,
): AmountExpressionState {
  if (state.operator) {
    return { ...state, right: value, replaceNext: false };
  }
  return { ...state, left: value, replaceNext: false };
}

export function appendDigit(
  state: AmountExpressionState,
  digit: string,
): AmountExpressionState {
  const current = currentOperand(state);

  if (state.replaceNext || current === "0") {
    return setCurrentOperand(state, digit);
  }

  return setCurrentOperand(state, `${current}${digit}`);
}

export function appendDecimal(
  state: AmountExpressionState,
): AmountExpressionState {
  const current = currentOperand(state);

  if (state.replaceNext) {
    return setCurrentOperand(state, "0.");
  }

  if (current.includes(".")) {
    return state;
  }

  return setCurrentOperand(state, current === "" ? "0." : `${current}.`);
}

export function backspace(state: AmountExpressionState): AmountExpressionState {
  // Dangling operator (e.g. "5 ×") — remove the operator first.
  if (state.operator && (state.right === "" || state.replaceNext)) {
    return { ...state, operator: null, right: "", replaceNext: false };
  }

  const current = currentOperand(state);

  // After equals / replaceNext, still delete one digit from the result
  // instead of wiping the whole value.
  if (current.length <= 1) {
    return setCurrentOperand({ ...state, replaceNext: false }, "0");
  }

  return setCurrentOperand(
    { ...state, replaceNext: false },
    current.slice(0, -1),
  );
}

export function setOperator(
  state: AmountExpressionState,
  operator: AmountOperator,
): AmountExpressionState {
  // Resolve the previous operation before chaining a new one.
  if (state.operator && state.right !== "" && state.right !== ".") {
    const result = evaluateExpression(state);
    if (result === null) {
      // Divide-by-zero: drop the invalid op and start the new one from left.
      return {
        left: state.left || "0",
        operator,
        right: "",
        replaceNext: true,
      };
    }
    return {
      left: formatOperand(result),
      operator,
      right: "",
      replaceNext: true,
    };
  }

  return {
    left: state.left || "0",
    operator,
    right: "",
    replaceNext: true,
  };
}

export function equals(state: AmountExpressionState): AmountExpressionState {
  if (!state.operator) {
    return { ...state, replaceNext: true };
  }

  // Incomplete expression (e.g. "5 ×") — just drop the dangling operator.
  if (state.right === "" || state.right === ".") {
    return {
      left: state.left || "0",
      operator: null,
      right: "",
      replaceNext: true,
    };
  }

  const result = evaluateExpression(state);

  // Divide-by-zero: keep the left operand and clear the bad operation.
  if (result === null) {
    return {
      left: state.left || "0",
      operator: null,
      right: "",
      replaceNext: true,
    };
  }

  return {
    left: formatOperand(result),
    operator: null,
    right: "",
    replaceNext: true,
  };
}

export function hasPendingOperation(state: AmountExpressionState): boolean {
  return state.operator !== null;
}

export function signedAmount(
  absoluteValue: number,
  mode: AmountSignMode,
): number {
  const magnitude = Math.abs(absoluteValue);
  return mode === "credit" ? -magnitude : magnitude;
}

function formatOperandForDisplay(value: string): string {
  if (!value || value === ".") return "0";

  const hasTrailingDot = value.endsWith(".");
  const [rawWhole, rawFraction = ""] = value.split(".");
  const wholeNumber = Number(rawWhole || "0");
  const whole = Number.isFinite(wholeNumber)
    ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
        wholeNumber,
      )
    : rawWhole;

  if (!value.includes(".")) {
    return whole;
  }

  if (hasTrailingDot && rawFraction === "") {
    return `${whole}.`;
  }

  return `${whole}.${rawFraction}`;
}

/**
 * Shows the live expression while an operation is in progress
 * (e.g. "IDR 5 × 8"), otherwise the resolved amount.
 */
export function formatExpressionDisplay(
  state: AmountExpressionState,
  currency: string,
): string {
  const left = formatOperandForDisplay(state.left || "0");

  if (!state.operator) {
    return `${currency} ${left}`;
  }

  if (state.right === "" || state.replaceNext) {
    return `${currency} ${left} ${state.operator}`;
  }

  const right = formatOperandForDisplay(state.right);
  return `${currency} ${left} ${state.operator} ${right}`;
}

export function formatAmountDisplay(value: number, currency: string): string {
  const absolute = Math.abs(value);
  const hasFraction = !Number.isInteger(absolute);
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  });

  return `${currency} ${formatter.format(absolute)}`;
}
