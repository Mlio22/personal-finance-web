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

export function formatMoney(
  amount: number,
  currency = "IDR",
  options?: { maximumFractionDigits?: number },
): string {
  if (currency === "IDR") {
    return formatIdr(amount, options);
  }

  if (currency === "XAUg") {
    return `XAUg ${amount}`;
  }

  const maximumFractionDigits =
    options?.maximumFractionDigits ?? (Math.abs(amount) < 1 ? 2 : 2);

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : Math.min(2, maximumFractionDigits),
    maximumFractionDigits,
  });

  return `${currency} ${formatter.format(amount)}`;
}
