"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategorySummaryItem } from "@/features/categories/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface DonutSegment {
  categoryId: string;
  color: string;
  value: number;
  startAngle: number;
  endAngle: number;
  length: number;
}

interface ExpenseDonutChartProps {
  categories: CategorySummaryItem[];
  totalExpenses: number;
  totalIncome: number;
  selectedCategoryId?: string | null;
  onSegmentSelect?: (categoryId: string) => void;
  className?: string;
}

const CHART_SIZE = 240;
const OUTER_RADIUS = 112;
const INNER_RADIUS = 90;
const RING_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;
const STROKE_WIDTH = OUTER_RADIUS - INNER_RADIUS;
const CENTER = CHART_SIZE / 2;
const FULL_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const DRAW_DURATION_MS = 900;

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeStrokeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(" ");
}

export function ExpenseDonutChart({
  categories,
  totalExpenses,
  totalIncome,
  selectedCategoryId,
  onSegmentSelect,
  className,
}: ExpenseDonutChartProps) {
  const [drawn, setDrawn] = useState(false);

  const segments = useMemo(() => {
    const spendingCategories = categories.filter(
      (category) => category.spentAmount > 0,
    );
    const totalSpent = spendingCategories.reduce(
      (sum, category) => sum + category.spentAmount,
      0,
    );

    if (totalSpent === 0) {
      return [] as DonutSegment[];
    }

    let currentAngle = 0;

    return spendingCategories.map((category) => {
      const sweep = (category.spentAmount / totalSpent) * 360;
      const length = (sweep / 360) * FULL_CIRCUMFERENCE;
      const segment: DonutSegment = {
        categoryId: category.id,
        color: category.color,
        value: category.spentAmount,
        startAngle: currentAngle,
        endAngle: currentAngle + sweep,
        length,
      };
      currentAngle += sweep;
      return segment;
    });
  }, [categories]);

  const segmentsKey = segments.map((segment) => segment.categoryId).join("|");

  useEffect(() => {
    setDrawn(false);
    const frame = requestAnimationFrame(() => {
      setDrawn(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [segmentsKey]);

  return (
    <div
      className={cn(
        "relative flex size-full min-h-0 min-w-0 items-center justify-center",
        className,
      )}
    >
      <svg
        className="aspect-square h-full w-full max-h-full max-w-full"
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Expense breakdown chart, total expenses ${formatIdr(totalExpenses)}`}
      >
        {segments.length > 0 ? (
          segments.map((segment, index) => (
            <path
              key={segment.categoryId}
              d={describeStrokeArc(
                CENTER,
                CENTER,
                RING_RADIUS,
                segment.startAngle,
                segment.endAngle,
              )}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="butt"
              strokeDasharray={`${segment.length} ${FULL_CIRCUMFERENCE}`}
              strokeDashoffset={drawn ? 0 : segment.length}
              className={cn(
                "cursor-pointer transition-[stroke-dashoffset,opacity] ease-out",
                selectedCategoryId &&
                  selectedCategoryId !== segment.categoryId &&
                  "opacity-35",
              )}
              style={{
                transitionDuration: `${DRAW_DURATION_MS}ms`,
                transitionDelay: drawn ? `${index * 60}ms` : "0ms",
              }}
              onClick={() => onSegmentSelect?.(segment.categoryId)}
            />
          ))
        ) : (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={FULL_CIRCUMFERENCE}
            strokeDashoffset={drawn ? 0 : FULL_CIRCUMFERENCE}
            className="text-muted/40 transition-[stroke-dashoffset] ease-out"
            style={{ transitionDuration: `${DRAW_DURATION_MS}ms` }}
          />
        )}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span className="text-[11px] font-medium text-muted-foreground">
          Expenses
        </span>
        <span className="mt-1 text-lg font-semibold tabular-nums text-expense">
          {formatIdr(totalExpenses)}
        </span>
        <span className="mt-0.5 text-sm font-medium tabular-nums text-income">
          {formatIdr(totalIncome)}
        </span>
      </div>
    </div>
  );
}
