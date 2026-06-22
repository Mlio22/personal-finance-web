export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted/70" />
          <div className="h-7 w-40 animate-pulse rounded bg-muted/70" />
        </div>
        <div className="size-10 animate-pulse rounded-full bg-muted/70" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-20 animate-pulse rounded-2xl bg-muted/60" />
      </div>

      <div className="h-48 animate-pulse rounded-2xl bg-muted/60" />

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded bg-muted/60" />
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-8 animate-pulse rounded bg-muted/60" />
            <div className="h-1.5 animate-pulse rounded-full bg-muted/60" />
          </div>
        ))}
      </div>

      <div className="h-20 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  );
}
