"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  canNavigatePeriod,
  formatCalendarMonthLabel,
  formatCalendarMonthPill,
  formatPeriodRangeLabel,
  formatPeriodRangePill,
  getCalendarMonthRange,
  getDefaultCustomRange,
  getPeriodBadge,
  getPeriodRange,
  navigatePeriodAnchor,
} from "@/features/period/lib/period-utils";
import type { DateRange, PeriodPreset, PeriodRange } from "@/features/period/types";

interface PeriodContextValue {
  preset: PeriodPreset;
  anchorDate: Date;
  customRange?: DateRange;
  range: PeriodRange;
  badge: string;
  displayLabel: string;
  pillLabel: string;
  canNavigate: boolean;
  setPreset: (preset: PeriodPreset) => void;
  setCustomRange: (range: DateRange) => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
}

const PeriodContext = createContext<PeriodContextValue | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<PeriodPreset>("month");
  const [anchorDate, setAnchorDate] = useState(() => startOfToday());
  const [customRange, setCustomRangeState] = useState<DateRange>(() =>
    getDefaultCustomRange(),
  );

  const range = useMemo(
    () => getPeriodRange(preset, anchorDate, customRange),
    [preset, anchorDate, customRange],
  );

  const badge = useMemo(
    () => getPeriodBadge(preset, anchorDate),
    [preset, anchorDate],
  );

  const displayLabel = useMemo(
    () => formatPeriodRangeLabel(preset, anchorDate, customRange),
    [preset, anchorDate, customRange],
  );

  const pillLabel = useMemo(
    () => formatPeriodRangePill(preset, anchorDate, customRange),
    [preset, anchorDate, customRange],
  );

  const canNavigate = canNavigatePeriod(preset);

  const setPreset = useCallback((nextPreset: PeriodPreset) => {
    setPresetState(nextPreset);

    if (nextPreset === "custom") {
      setCustomRangeState((current) => current ?? getDefaultCustomRange());
    }
  }, []);

  const setCustomRange = useCallback((range: DateRange) => {
    setPresetState("custom");
    setCustomRangeState(range);
    setAnchorDate(startOfDay(range.end));
  }, []);

  const navigatePrevious = useCallback(() => {
    if (!canNavigatePeriod(preset)) {
      return;
    }

    setAnchorDate((current) => navigatePeriodAnchor(preset, current, "previous"));
  }, [preset]);

  const navigateNext = useCallback(() => {
    if (!canNavigatePeriod(preset)) {
      return;
    }

    setAnchorDate((current) => navigatePeriodAnchor(preset, current, "next"));
  }, [preset]);

  const value = useMemo(
    () => ({
      preset,
      anchorDate,
      customRange,
      range,
      badge,
      displayLabel,
      pillLabel,
      canNavigate,
      setPreset,
      setCustomRange,
      navigatePrevious,
      navigateNext,
    }),
    [
      preset,
      anchorDate,
      customRange,
      range,
      badge,
      displayLabel,
      pillLabel,
      canNavigate,
      setPreset,
      setCustomRange,
      navigatePrevious,
      navigateNext,
    ],
  );

  return (
    <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
  );
}

export function usePeriod() {
  const context = useContext(PeriodContext);

  if (!context) {
    throw new Error("usePeriod must be used within PeriodProvider");
  }

  return context;
}

export function useLockedCalendarMonthPeriod(): PeriodContextValue {
  const period = usePeriod();
  const today = useMemo(() => new Date(), []);
  const lockedRange = useMemo(() => getCalendarMonthRange(today), [today]);
  const lockedLabel = useMemo(() => formatCalendarMonthLabel(today), [today]);
  const lockedPillLabel = useMemo(() => formatCalendarMonthPill(today), [today]);

  return useMemo(
    () => ({
      ...period,
      preset: "month",
      range: lockedRange,
      badge: "30",
      displayLabel: lockedLabel,
      pillLabel: lockedPillLabel,
      canNavigate: false,
      navigatePrevious: () => undefined,
      navigateNext: () => undefined,
      setPreset: () => undefined,
      setCustomRange: () => undefined,
    }),
    [period, lockedRange, lockedLabel, lockedPillLabel],
  );
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}
