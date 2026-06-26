"use client";

import { useMemo } from "react";
import type { DailyBreakdownItem } from "@/features/categories/types";
import {
  CHART_GRID_VALUES,
  CHART_MAX_VALUE,
  formatChartAxisLabel,
  formatChartDateLabel,
  getDailyTotal,
} from "@/features/overview/lib/chart-utils";
import { cn } from "@/lib/utils";

interface DailyActivityChartProps {
  dailyBreakdown: DailyBreakdownItem[];
}

const BAR_WIDTH = 18;
const BAR_GAP = 6;
const CHART_HEIGHT = 180;
const Y_AXIS_WIDTH = 72;

const SEGMENT_COLORS = {
  green: "#4ade80",
  yellow: "#fbbf24",
  grey: "#9ca3af",
} as const;

export function DailyActivityChart({ dailyBreakdown }: DailyActivityChartProps) {
  const chartWidth = dailyBreakdown.length * (BAR_WIDTH + BAR_GAP);

  const labeledDays = useMemo(
    () =>
      dailyBreakdown.map((day) => ({
        date: day.date,
        label: formatChartDateLabel(day.date),
      })),
    [dailyBreakdown],
  );

  return (
    <section aria-label="Daily activity chart">
      <div className="relative">
        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="relative"
            style={{
              width: `max(100%, ${chartWidth + Y_AXIS_WIDTH}px)`,
              minWidth: "100%",
            }}
          >
            <div
              className="absolute inset-y-0 right-0 z-10 flex flex-col justify-between py-1 text-[10px] text-muted-foreground"
              style={{ width: Y_AXIS_WIDTH }}
            >
              {[...CHART_GRID_VALUES].reverse().map((value) => (
                <span key={value} className="text-right leading-none">
                  {formatChartAxisLabel(value)}
                </span>
              ))}
              <span className="text-right leading-none">IDR 0</span>
            </div>

            <div
              className="relative pr-[72px]"
              style={{ height: CHART_HEIGHT }}
            >
              {CHART_GRID_VALUES.map((value) => {
                const top = CHART_HEIGHT - (value / CHART_MAX_VALUE) * CHART_HEIGHT;

                return (
                  <div
                    key={value}
                    className="absolute right-[72px] left-0 border-t border-dashed border-border/70"
                    style={{ top }}
                  />
                );
              })}

              <div
                className="absolute bottom-0 left-0 flex items-end"
                style={{
                  gap: BAR_GAP,
                  height: CHART_HEIGHT,
                }}
              >
                {dailyBreakdown.map((day) => (
                  <StackedBar key={day.date} day={day} />
                ))}
              </div>
            </div>

            <div
              className="mt-2 flex pr-[72px]"
              style={{ gap: BAR_GAP }}
            >
              {dailyBreakdown.map((day, index) => (
                <div
                  key={`label-${day.date}`}
                  className="shrink-0 text-center text-[10px] text-muted-foreground"
                  style={{ width: BAR_WIDTH }}
                >
                  {labeledDays[index]?.label ?? ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedBar({ day }: { day: DailyBreakdownItem }) {
  const total = getDailyTotal(day);
  const heightPercent = Math.min((total / CHART_MAX_VALUE) * 100, 100);
  const segments = [
    { key: "green", value: day.amounts.green },
    { key: "yellow", value: day.amounts.yellow },
    { key: "grey", value: day.amounts.grey },
  ] as const;

  return (
    <div
      className="flex shrink-0 flex-col justify-end"
      style={{ width: BAR_WIDTH, height: CHART_HEIGHT }}
      title={`${day.date}: IDR ${total.toLocaleString()}`}
    >
      <div
        className="flex w-full flex-col-reverse overflow-hidden rounded-sm"
        style={{ height: `${heightPercent}%` }}
      >
        {segments.map((segment) => {
          if (segment.value <= 0 || total <= 0) {
            return null;
          }

          const segmentHeight = (segment.value / total) * 100;

          return (
            <div
              key={segment.key}
              className={cn("w-full min-h-px")}
              style={{
                height: `${segmentHeight}%`,
                backgroundColor: SEGMENT_COLORS[segment.key],
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
