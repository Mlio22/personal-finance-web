import type { PeriodRange } from "@/features/period/types";

function toExclusiveEnd(end: Date): Date {
  const exclusiveEnd = new Date(end);
  exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);
  exclusiveEnd.setHours(0, 0, 0, 0);
  return exclusiveEnd;
}

export function buildPeriodQueryParams(
  range: PeriodRange,
  accountId?: string,
): URLSearchParams {
  const params = new URLSearchParams();

  if (range.start) {
    params.set("periodStart", range.start.toISOString());
  }

  if (range.end) {
    params.set("periodEnd", toExclusiveEnd(range.end).toISOString());
  }

  if (accountId && accountId !== "all") {
    params.set("accountId", accountId);
  }

  return params;
}

export function buildPeriodQueryString(
  range: PeriodRange,
  accountId?: string,
): string {
  const params = buildPeriodQueryParams(range, accountId);
  const query = params.toString();
  return query ? `?${query}` : "";
}
