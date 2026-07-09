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

function formatOperand(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(8)).toString());
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
): number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? left : left / right;
  }
}

export function evaluateExpression(state: AmountExpressionState): number {
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

export function appendDecimal(state: AmountExpressionState): AmountExpressionState {
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
  if (state.operator && state.right === "" && !state.replaceNext) {
    return { ...state, operator: null, replaceNext: false };
  }

  const current = currentOperand(state);

  if (state.replaceNext) {
    return setCurrentOperand({ ...state, replaceNext: false }, "0");
  }

  if (current.length <= 1) {
    return setCurrentOperand(state, "0");
  }

  return setCurrentOperand(state, current.slice(0, -1));
}

export function setOperator(
  state: AmountExpressionState,
  operator: AmountOperator,
): AmountExpressionState {
  if (state.operator && state.right !== "") {
    const result = evaluateExpression(state);
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

  const result = evaluateExpression(state);
  return {
    left: formatOperand(result),
    operator: null,
    right: "",
    replaceNext: true,
  };
}

export function signedAmount(
  absoluteValue: number,
  mode: AmountSignMode,
): number {
  const magnitude = Math.abs(absoluteValue);
  return mode === "credit" ? -magnitude : magnitude;
}

export function formatAmountDisplay(
  value: number,
  currency: string,
): string {
  const absolute = Math.abs(value);
  const hasFraction = !Number.isInteger(absolute);
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  });

  return `${currency} ${formatter.format(absolute)}`;
}
