import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** When true, show the raw progress number without a % suffix (MoneyIQ style). */
  showPercentSign?: boolean;
}

export function ProgressRing({
  progress,
  size = 40,
  strokeWidth = 3,
  className,
  showPercentSign = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clampedProgress}% progress`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-progress transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[0.7rem] font-semibold tabular-nums text-foreground">
        {clampedProgress}
        {showPercentSign ? "%" : ""}
      </span>
    </div>
  );
}
