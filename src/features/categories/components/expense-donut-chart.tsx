"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoryKind, CategorySummaryItem } from "@/features/categories/types";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface DonutSegment {
  categoryId: string;
  color: string;
  value: number;
  startAngle: number;
  endAngle: number;
}

interface ExpenseDonutChartProps {
  categories: CategorySummaryItem[];
  totalExpenses: number;
  totalIncome: number;
  viewKind?: CategoryKind;
  selectedCategoryId?: string | null;
  onToggleKind?: () => void;
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
  viewKind = "expense",
  selectedCategoryId,
  onToggleKind,
  className,
}: ExpenseDonutChartProps) {
  const maskId = useId().replace(/:/g, "");
  const [drawn, setDrawn] = useState(false);
  const hasPlayedEntranceRef = useRef(false);
  const isIncomeView = viewKind === "income";

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
      const segment: DonutSegment = {
        categoryId: category.id,
        color: category.color,
        value: category.spentAmount,
        startAngle: currentAngle,
        endAngle: currentAngle + sweep,
      };
      currentAngle += sweep;
      return segment;
    });
  }, [categories]);

  useEffect(() => {
    if (hasPlayedEntranceRef.current) {
      setDrawn(true);
      return;
    }

    hasPlayedEntranceRef.current = true;
    let nextFrame = 0;
    const frame = requestAnimationFrame(() => {
      nextFrame = requestAnimationFrame(() => {
        setDrawn(true);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(nextFrame);
    };
  }, []);

  const primaryLabel = isIncomeView ? "Income" : "Expenses";
  const primaryAmount = isIncomeView ? totalIncome : totalExpenses;
  const secondaryAmount = isIncomeView ? totalExpenses : totalIncome;
  const ariaLabel = `${primaryLabel} breakdown chart, total ${formatIdr(primaryAmount)}. Click to switch to ${isIncomeView ? "expenses" : "income"}.`;

  return (
    <button
      type="button"
      onClick={onToggleKind}
      aria-label={ariaLabel}
      className={cn(
        "relative flex size-full min-h-0 min-w-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0",
        className,
      )}
    >
      <svg
        className="pointer-events-none aspect-square h-full w-full max-h-full max-w-full"
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RING_RADIUS}
              fill="none"
              stroke="white"
              strokeWidth={STROKE_WIDTH + 4}
              strokeDasharray={FULL_CIRCUMFERENCE}
              strokeDashoffset={drawn ? 0 : FULL_CIRCUMFERENCE}
              strokeLinecap="butt"
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              className="transition-[stroke-dashoffset] ease-out"
              style={{ transitionDuration: `${DRAW_DURATION_MS}ms` }}
            />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          {segments.length > 0 ? (
            segments.map((segment) => (
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
                className={cn(
                  selectedCategoryId &&
                    selectedCategoryId !== segment.categoryId &&
                    "opacity-35",
                )}
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
              className="text-muted/40"
            />
          )}
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
        <span className="text-[11px] font-medium text-muted-foreground">
          {primaryLabel}
        </span>
        <span
          className={cn(
            "mt-1 text-lg font-semibold tabular-nums",
            isIncomeView ? "text-income" : "text-expense",
          )}
        >
          {formatIdr(primaryAmount)}
        </span>
        <span
          className={cn(
            "mt-0.5 text-sm font-medium tabular-nums",
            isIncomeView ? "text-expense" : "text-income",
          )}
        >
          {formatIdr(secondaryAmount)}
        </span>
      </div>
    </button>
  );
}
