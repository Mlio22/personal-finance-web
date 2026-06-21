import type { DateRange, PeriodPreset, PeriodRange } from "@/features/period/types";

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTH_NAMES_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfWeek(date: Date): Date {
  const result = startOfDay(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}

function endOfWeek(date: Date): Date {
  return endOfDay(addDays(startOfWeek(date), 6));
}

function startOfMonth(date: Date): Date {
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));
}

function endOfMonth(date: Date): Date {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

function startOfYear(date: Date): Date {
  return startOfDay(new Date(date.getFullYear(), 0, 1));
}

function endOfYear(date: Date): Date {
  return endOfDay(new Date(date.getFullYear(), 11, 31));
}

function formatDayMonth(date: Date, uppercase = false): string {
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  return `${date.getDate()} ${uppercase ? month.toUpperCase() : month}`;
}

function formatMonthDay(date: Date): string {
  return `${MONTH_NAMES_LONG[date.getMonth()]} ${date.getDate()}`;
}

export function getPeriodRange(
  preset: PeriodPreset,
  anchorDate: Date,
  customRange?: DateRange,
): PeriodRange {
  const anchor = startOfDay(anchorDate);

  switch (preset) {
    case "all-time":
      return { start: null, end: null };
    case "today":
    case "day":
      return { start: anchor, end: endOfDay(anchor) };
    case "week":
      return { start: startOfWeek(anchor), end: endOfWeek(anchor) };
    case "month":
      return { start: startOfDay(addDays(anchor, -29)), end: endOfDay(anchor) };
    case "year":
      return { start: startOfYear(anchor), end: endOfYear(anchor) };
    case "custom":
      if (!customRange) {
        return { start: anchor, end: endOfDay(anchor) };
      }
      return {
        start: startOfDay(customRange.start),
        end: endOfDay(customRange.end),
      };
    default:
      return { start: anchor, end: endOfDay(anchor) };
  }
}

export function getCalendarMonthRange(referenceDate = new Date()): PeriodRange {
  return {
    start: startOfMonth(referenceDate),
    end: endOfMonth(referenceDate),
  };
}

export function getPeriodBadge(preset: PeriodPreset, anchorDate: Date): string {
  switch (preset) {
    case "all-time":
      return "∞";
    case "today":
      return "1";
    case "day":
      return String(anchorDate.getDate());
    case "week":
      return "7";
    case "month":
      return "30";
    case "year":
      return "365";
    case "custom":
      return "…";
    default:
      return "1";
  }
}

export function formatPeriodRangeLabel(
  preset: PeriodPreset,
  anchorDate: Date,
  customRange?: DateRange,
): string {
  if (preset === "all-time") {
    return "All time";
  }

  if (preset === "year") {
    return `Year ${anchorDate.getFullYear()}`;
  }

  const range = getPeriodRange(preset, anchorDate, customRange);

  if (!range.start || !range.end) {
    return "All time";
  }

  if (preset === "today" || preset === "day") {
    return formatMonthDay(range.start);
  }

  const sameYear = range.start.getFullYear() === range.end.getFullYear();
  const sameMonth = sameYear && range.start.getMonth() === range.end.getMonth();

  if (preset === "week" && sameMonth) {
    return `${range.start.getDate()} – ${range.end.getDate()} ${MONTH_NAMES_SHORT[range.end.getMonth()]}`;
  }

  if (sameYear && sameMonth) {
    return `${range.start.getDate()} – ${range.end.getDate()} ${MONTH_NAMES_SHORT[range.end.getMonth()]}`;
  }

  if (sameYear) {
    return `${formatDayMonth(range.start)} – ${formatDayMonth(range.end)} ${range.end.getFullYear()}`;
  }

  return `${formatDayMonth(range.start)} – ${formatDayMonth(range.end, true)} ${range.end.getFullYear()}`;
}

export function formatPeriodRangePill(
  preset: PeriodPreset,
  anchorDate: Date,
  customRange?: DateRange,
): string {
  if (preset === "all-time") {
    return "ALL TIME";
  }

  if (preset === "year") {
    return `YEAR ${anchorDate.getFullYear()}`;
  }

  const range = getPeriodRange(preset, anchorDate, customRange);

  if (!range.start || !range.end) {
    return "ALL TIME";
  }

  if (preset === "today" || preset === "day") {
    return formatDayMonth(range.start, true);
  }

  const sameYear = range.start.getFullYear() === range.end.getFullYear();

  if (sameYear) {
    return `${formatDayMonth(range.start, true)} – ${formatDayMonth(range.end, true)} ${range.end.getFullYear()}`;
  }

  return `${formatDayMonth(range.start, true)} – ${formatDayMonth(range.end, true)} ${range.end.getFullYear()}`;
}

export function formatPeriodOptionSubtext(
  preset: PeriodPreset,
  anchorDate: Date,
  customRange?: DateRange,
): string {
  return formatPeriodRangeLabel(preset, anchorDate, customRange);
}

export function canNavigatePeriod(preset: PeriodPreset, locked = false): boolean {
  if (locked) {
    return false;
  }

  return preset !== "all-time" && preset !== "custom";
}

export function navigatePeriodAnchor(
  preset: PeriodPreset,
  anchorDate: Date,
  direction: "previous" | "next",
): Date {
  const delta = direction === "next" ? 1 : -1;

  switch (preset) {
    case "today":
    case "day":
      return addDays(anchorDate, delta);
    case "week":
      return addDays(anchorDate, 7 * delta);
    case "month":
      return addDays(anchorDate, 30 * delta);
    case "year": {
      const result = new Date(anchorDate);
      result.setFullYear(result.getFullYear() + delta);
      return result;
    }
    default:
      return anchorDate;
  }
}

export function getDefaultCustomRange(anchorDate = new Date()): DateRange {
  const end = startOfDay(anchorDate);
  return {
    start: addDays(end, -29),
    end,
  };
}

export function formatCalendarMonthLabel(referenceDate = new Date()): string {
  const range = getCalendarMonthRange(referenceDate);

  if (!range.start || !range.end) {
    return "";
  }

  return `${range.start.getDate()} ${MONTH_NAMES_SHORT[range.start.getMonth()]} – ${range.end.getDate()} ${MONTH_NAMES_SHORT[range.end.getMonth()]} ${range.end.getFullYear()}`;
}

export function formatCalendarMonthPill(referenceDate = new Date()): string {
  const range = getCalendarMonthRange(referenceDate);

  if (!range.start || !range.end) {
    return "";
  }

  return `${range.start.getDate()} ${MONTH_NAMES_SHORT[range.start.getMonth()].toUpperCase()} – ${range.end.getDate()} ${MONTH_NAMES_SHORT[range.end.getMonth()].toUpperCase()} ${range.end.getFullYear()}`;
}
