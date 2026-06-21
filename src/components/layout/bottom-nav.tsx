"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_TABS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="sticky bottom-0 z-50 border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex h-[4.5rem] max-w-lg items-center justify-around px-2">
        {MAIN_TABS.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-2 text-[0.7rem] font-medium transition-colors",
                isActive
                  ? "bg-nav-active text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
