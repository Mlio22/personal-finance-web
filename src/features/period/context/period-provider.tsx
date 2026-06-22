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
  getCalendarMonthBadge,
  getCalendarMonthRange,
  getDefaultCustomRange,
  getPeriodBadge,
  getPeriodRange,
  navigateCalendarMonth,
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

const LockedCalendarMonthContext = createContext<PeriodContextValue | null>(
  null,
);

export function LockedCalendarMonthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useLockedCalendarMonthPeriodState();

  return (
    <LockedCalendarMonthContext.Provider value={value}>
      {children}
    </LockedCalendarMonthContext.Provider>
  );
}

export function useLockedCalendarMonthPeriod(): PeriodContextValue {
  const context = useContext(LockedCalendarMonthContext);

  if (!context) {
    throw new Error(
      "useLockedCalendarMonthPeriod must be used within LockedCalendarMonthProvider",
    );
  }

  return context;
}

function useLockedCalendarMonthPeriodState(): PeriodContextValue {
  const [anchorMonth, setAnchorMonth] = useState(() => startOfCurrentMonth());

  const lockedRange = useMemo(
    () => getCalendarMonthRange(anchorMonth),
    [anchorMonth],
  );
  const lockedLabel = useMemo(
    () => formatCalendarMonthLabel(anchorMonth),
    [anchorMonth],
  );
  const lockedPillLabel = useMemo(
    () => formatCalendarMonthPill(anchorMonth),
    [anchorMonth],
  );
  const badge = useMemo(
    () => getCalendarMonthBadge(anchorMonth),
    [anchorMonth],
  );

  const navigatePrevious = useCallback(() => {
    setAnchorMonth((current) => navigateCalendarMonth(current, "previous"));
  }, []);

  const navigateNext = useCallback(() => {
    setAnchorMonth((current) => navigateCalendarMonth(current, "next"));
  }, []);

  return useMemo(
    () => ({
      preset: "month",
      anchorDate: anchorMonth,
      customRange: undefined,
      range: lockedRange,
      badge,
      displayLabel: lockedLabel,
      pillLabel: lockedPillLabel,
      canNavigate: true,
      navigatePrevious,
      navigateNext,
      setPreset: () => undefined,
      setCustomRange: () => undefined,
    }),
    [
      anchorMonth,
      lockedRange,
      badge,
      lockedLabel,
      lockedPillLabel,
      navigatePrevious,
      navigateNext,
    ],
  );
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function startOfCurrentMonth(): Date {
  const today = startOfToday();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}
