"use client";

import {
  Calendar,
  Check,
  Infinity,
  MoreHorizontal,
} from "lucide-react";
import {
  formatPeriodOptionSubtext,
  getDefaultCustomRange,
} from "@/features/period/lib/period-utils";
import { usePeriod } from "@/features/period/context/period-provider";
import type { PeriodPreset } from "@/features/period/types";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface PeriodPickerDrawerProps {
  locked?: boolean;
  trigger: React.ReactNode;
}

const PERIOD_OPTIONS: Array<{
  preset: PeriodPreset;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    preset: "all-time",
    label: "All time",
    icon: <Infinity className="size-5" aria-hidden="true" />,
  },
  {
    preset: "day",
    label: "Select day",
    icon: <Calendar className="size-5" aria-hidden="true" />,
  },
  {
    preset: "week",
    label: "Week",
    icon: <PeriodBadge value="7" />,
  },
  {
    preset: "today",
    label: "Today",
    icon: <PeriodBadge value="1" />,
  },
  {
    preset: "year",
    label: "Year",
    icon: <PeriodBadge value="365" />,
  },
  {
    preset: "month",
    label: "Month",
    icon: <PeriodBadge value="30" />,
  },
];

export function PeriodPickerDrawer({ locked = false, trigger }: PeriodPickerDrawerProps) {
  const { preset, anchorDate, customRange, setPreset, setCustomRange } =
    usePeriod();

  if (locked) {
    return <>{trigger}</>;
  }

  const customRangeLabel = formatPeriodOptionSubtext(
    "custom",
    anchorDate,
    customRange ?? getDefaultCustomRange(anchorDate),
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>

      <DrawerContent className="px-4 pb-8">
        <DrawerHeader className="px-0">
          <DrawerTitle>Period</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4">
          <DrawerClose asChild>
            <button
              type="button"
              onClick={() => setCustomRange(customRange ?? getDefaultCustomRange(anchorDate))}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <MoreHorizontal className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">Select range</span>
                <span className="block text-xs text-muted-foreground">{customRangeLabel}</span>
              </span>
            </button>
          </DrawerClose>

          <div className="grid grid-cols-2 gap-3">
            {PERIOD_OPTIONS.map((option) => (
              <PeriodOption
                key={option.preset}
                label={option.label}
                icon={option.icon}
                subtext={formatPeriodOptionSubtext(option.preset, anchorDate, customRange)}
                selected={preset === option.preset}
                onSelect={() => setPreset(option.preset)}
              />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function PeriodOption({
  label,
  icon,
  subtext,
  selected,
  onSelect,
}: {
  label: string;
  icon: React.ReactNode;
  subtext: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <DrawerClose asChild>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-3 py-4 text-center transition-colors hover:bg-muted/40",
          selected && "border-positive/40 bg-positive/10",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
          {icon}
        </span>
        <span className="space-y-0.5">
          <span className="flex items-center justify-center gap-1 text-sm font-medium">
            {label}
            {selected ? <Check className="size-3.5 text-positive" aria-hidden="true" /> : null}
          </span>
          <span className="block text-xs text-muted-foreground">{subtext}</span>
        </span>
      </button>
    </DrawerClose>
  );
}

function PeriodBadge({ value }: { value: string }) {
  return (
    <span className="text-sm font-semibold" aria-hidden="true">
      {value}
    </span>
  );
}
