const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTH_NAMES = [
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

export function formatTransactionDateHeader(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const weekday = WEEKDAY_NAMES[date.getDay()].toUpperCase();
  const monthName = MONTH_NAMES[date.getMonth()].toUpperCase();

  return `${day} ${weekday} ${monthName} ${year}`;
}
