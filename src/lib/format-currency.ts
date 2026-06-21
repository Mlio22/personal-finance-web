const IDR_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatIdr(amount: number): string {
  return `IDR ${IDR_FORMATTER.format(amount)}`;
}

export function formatSignedIdr(amount: number): string {
  const prefix = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${prefix}${formatIdr(Math.abs(amount))}`;
}
