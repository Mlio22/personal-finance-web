const IDR_WHOLE_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatIdr(
  amount: number,
  options?: { maximumFractionDigits?: number },
): string {
  const maximumFractionDigits = options?.maximumFractionDigits ?? 0;
  const hasFraction = maximumFractionDigits > 0 && amount % 1 !== 0;

  const formatter = hasFraction
    ? new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits,
      })
    : IDR_WHOLE_FORMATTER;

  return `IDR ${formatter.format(amount)}`;
}

export function formatSignedIdr(amount: number): string {
  const prefix = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${prefix}${formatIdr(Math.abs(amount))}`;
}
