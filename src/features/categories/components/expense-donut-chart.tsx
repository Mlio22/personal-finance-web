"use client";

import { useMemo } from "react";
import type { CategorySummaryItem } from "@/features/categories/types";
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
  selectedCategoryId?: string | null;
  onSegmentSelect?: (categoryId: string) => void;
  className?: string;
}

const CHART_SIZE = 220;
const OUTER_RADIUS = 100;
const INNER_RADIUS = 68;
const CENTER = CHART_SIZE / 2;

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

function describeArc(
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    "M",
    startOuter.x,
    startOuter.y,
    "A",
    outerRadius,
    outerRadius,
    0,
    largeArcFlag,
    1,
    endOuter.x,
    endOuter.y,
    "L",
    startInner.x,
    startInner.y,
    "A",
    innerRadius,
    innerRadius,
    0,
    largeArcFlag,
    0,
    endInner.x,
    endInner.y,
    "Z",
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

  return (
    <div className={cn("relative mx-auto flex items-center justify-center", className)}>
      <svg
        width={CHART_SIZE}
        height={CHART_SIZE}
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        role="img"
        aria-label={`Expense breakdown chart, total expenses ${formatIdr(totalExpenses)}`}
      >
        {segments.length > 0 ? (
          segments.map((segment) => (
            <path
              key={segment.categoryId}
              d={describeArc(
                CENTER,
                CENTER,
                OUTER_RADIUS,
                INNER_RADIUS,
                segment.startAngle,
                segment.endAngle,
              )}
              fill={segment.color}
              stroke="#121212"
              strokeWidth={2}
              className={cn(
                "cursor-pointer transition-opacity",
                selectedCategoryId &&
                  selectedCategoryId !== segment.categoryId &&
                  "opacity-35",
              )}
              onClick={() => onSegmentSelect?.(segment.categoryId)}
            />
          ))
        ) : (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={OUTER_RADIUS - INNER_RADIUS}
            className="text-muted/40"
          />
        )}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs text-muted-foreground">Expenses</span>
        <span className="text-lg font-semibold text-expense">
          {formatIdr(totalExpenses)}
        </span>
        <span className="text-sm font-medium text-income">
          {formatIdr(totalIncome)}
        </span>
      </div>
    </div>
  );
}
