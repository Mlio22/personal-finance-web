export type PeriodPreset =
  | "all-time"
  | "day"
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PeriodState {
  preset: PeriodPreset;
  anchorDate: Date;
  customRange?: DateRange;
}

export interface PeriodRange {
  start: Date | null;
  end: Date | null;
}
