export const RECURRENCE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "every_day", label: "Every day" },
  { value: "every_2_days", label: "Every 2 days" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "every_week", label: "Every week" },
  { value: "every_2_weeks", label: "Every 2 weeks" },
  { value: "every_4_weeks", label: "Every 4 weeks" },
  { value: "every_month", label: "Every month" },
  { value: "every_2_months", label: "Every 2 months" },
  { value: "every_3_months", label: "Every 3 months" },
  { value: "every_6_months", label: "Every 6 months" },
  { value: "every_year", label: "Every year" },
] as const;

export const REMINDER_OPTIONS = [
  { value: "none", label: "None" },
  { value: "same_day", label: "Same day" },
  { value: "1_day_before", label: "1 day before" },
  { value: "2_days_before", label: "2 days before" },
  { value: "3_days_before", label: "3 days before" },
  { value: "4_days_before", label: "4 days before" },
  { value: "5_days_before", label: "5 days before" },
  { value: "6_days_before", label: "6 days before" },
  { value: "7_days_before", label: "7 days before" },
] as const;

export type RecurrenceValue = (typeof RECURRENCE_OPTIONS)[number]["value"];
export type ReminderValue = (typeof REMINDER_OPTIONS)[number]["value"];

export function getRecurrenceLabel(value: RecurrenceValue): string {
  return RECURRENCE_OPTIONS.find((option) => option.value === value)?.label ?? "None";
}

export function getReminderLabel(value: ReminderValue): string {
  return REMINDER_OPTIONS.find((option) => option.value === value)?.label ?? "None";
}
