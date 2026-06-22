"use client";

import { CalendarDays, ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  useLockedCalendarMonthPeriod,
  usePeriod,
} from "@/features/period/context/period-provider";
import { PeriodPickerDrawer } from "@/features/period/components/period-picker-drawer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PeriodSelectorProps {
  locked?: boolean;
}

export function PeriodSelector({ locked = false }: PeriodSelectorProps) {
  const globalPeriod = usePeriod();
  const lockedPeriod = useLockedCalendarMonthPeriod();
  const period = locked ? lockedPeriod : globalPeriod;
  const { badge, pillLabel, canNavigate, navigatePrevious, navigateNext } = period;

  const pill = (
    <Button
      variant="secondary"
      className={cn(
        "h-10 min-w-0 flex-1 gap-2 rounded-full border border-border/60 bg-card px-3 shadow-none",
        locked ? "cursor-default opacity-90" : "hover:bg-card/80",
      )}
      type="button"
      disabled={locked}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background text-xs font-semibold">
        {badge === "∞" ? (
          <span className="text-sm leading-none">∞</span>
        ) : (
          badge
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-medium tracking-wide">
        {pillLabel}
      </span>
      {!locked ? (
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      ) : (
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
    </Button>
  );

  return (
    <div className="flex items-center gap-1 px-3 pb-3">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-full"
        aria-label="Previous period"
        type="button"
        onClick={navigatePrevious}
        disabled={!canNavigate}
      >
        <ChevronsLeft className="size-5" aria-hidden="true" />
      </Button>

      <PeriodPickerDrawer locked={locked} trigger={pill} />

      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 rounded-full"
        aria-label="Next period"
        type="button"
        onClick={navigateNext}
        disabled={!canNavigate}
      >
        <ChevronsRight className="size-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
