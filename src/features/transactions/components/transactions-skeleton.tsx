export function TransactionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-2">
          <div className="flex justify-between px-3">
            <div className="h-3 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          {Array.from({ length: 2 }).map((__, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center gap-3 rounded-xl px-3 py-3"
            >
              <div className="size-9 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
