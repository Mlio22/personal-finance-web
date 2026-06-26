import type { DailyBreakdownItem } from "@/features/categories/types";

export const CHART_MAX_VALUE = 1_800_000;
export const CHART_GRID_VALUES = [900_000, 1_800_000] as const;

export function getDailyTotal(day: DailyBreakdownItem): number {
  const { green, yellow, grey } = day.amounts;
  return green + yellow + grey;
}

export function formatChartAxisLabel(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return Number.isInteger(millions)
      ? `IDR ${millions}M`
      : `IDR ${millions.toFixed(1)}M`;
  }

  const thousands = amount / 1_000;
  return `IDR ${thousands}K`;
}

export function formatChartDateLabel(dateString: string): string | null {
  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();

  if (day === 1 || day === 20) {
    return `${day} ${month}`;
  }

  if (day === 19 && month === "jun") {
    return "19 jun";
  }

  if (day % 7 === 1 || day === 8 || day === 15 || day === 25) {
    return String(day);
  }

  return null;
}
