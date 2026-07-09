export const ACCOUNT_CURRENCIES = [
  { code: "IDR", label: "Indonesian rupiah – IDR" },
  { code: "USD", label: "US dollar – USD" },
  { code: "EUR", label: "Euro – EUR" },
  { code: "SGD", label: "Singapore dollar – SGD" },
  { code: "XAUg", label: "Gold gram – XAUg" },
] as const;

export type AccountCurrencyCode = (typeof ACCOUNT_CURRENCIES)[number]["code"];

export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  regular: "Regular",
  debt: "Debt",
  savings: "Savings",
  investment: "Investment",
};

export function getCurrencyLabel(code: string): string {
  return (
    ACCOUNT_CURRENCIES.find((currency) => currency.code === code)?.label ??
    code
  );
}
