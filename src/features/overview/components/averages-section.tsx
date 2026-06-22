import { formatIdr } from "@/lib/format-currency";
import type { OverviewAverages } from "@/features/categories/types";

interface AveragesSectionProps {
  averages: OverviewAverages;
}

const AVERAGE_ITEMS = [
  { key: "daily", label: "Day (avg.)" },
  { key: "weekly", label: "Week (avg.)" },
  { key: "monthly", label: "Month" },
] as const;

export function AveragesSection({ averages }: AveragesSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {AVERAGE_ITEMS.map((item) => (
        <div key={item.key} className="text-center">
          <p className="text-[11px] text-muted-foreground">{item.label}</p>
          <p className="mt-1 text-sm font-semibold text-expense">
            {formatIdr(averages[item.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
