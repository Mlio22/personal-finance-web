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

export const ACCOUNT_ICON_COLORS = [
  "#14B8A6",
  "#3B82F6",
  "#22D3EE",
  "#0EA5E9",
  "#FACC15",
  "#EC4899",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
  "#A78BFA",
  "#374151",
  "#6B7280",
  "#92400E",
  "#DB2777",
] as const;

export function getCurrencyLabel(code: string): string {
  return (
    ACCOUNT_CURRENCIES.find((currency) => currency.code === code)?.label ??
    code
  );
}

export function getTypeIconForAccountType(type: string) {
  switch (type) {
    case "savings":
      return "vault" as const;
    case "debt":
      return "hand" as const;
    case "investment":
      return "chart" as const;
    default:
      return "wallet" as const;
  }
}
