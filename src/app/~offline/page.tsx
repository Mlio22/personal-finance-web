"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <WifiOff className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">You&apos;re offline</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          MoneyIQ can&apos;t reach the network right now. Check your connection
          and try again.
        </p>
      </div>
      <Button
        type="button"
        onClick={() => window.location.reload()}
        className="min-w-32"
      >
        Try again
      </Button>
    </div>
  );
}
