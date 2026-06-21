"use client";

import { usePathname } from "next/navigation";
import { AccountFilterSheet } from "@/features/accounts/components/account-filter-sheet";
import { PeriodSelector } from "@/features/period/components/period-selector";
import { UserSettingsDrawer } from "@/features/settings/components/user-settings-drawer";
import { getTabByPathname } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

const PERIOD_SELECTOR_TABS = new Set([
  "categories",
  "transactions",
  "budget",
  "overview",
]);

export function AppHeader() {
  const pathname = usePathname();
  const currentTab = getTabByPathname(pathname);
  const ActionIcon = currentTab?.actionIcon;
  const showPeriodSelector = currentTab
    ? PERIOD_SELECTOR_TABS.has(currentTab.id)
    : false;
  const isBudgetTab = currentTab?.id === "budget";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-2 px-3">
        <UserSettingsDrawer />

        <AccountFilterSheet />

        {ActionIcon ? (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label={currentTab.actionLabel}
            type="button"
          >
            <ActionIcon className="size-5" aria-hidden="true" />
          </Button>
        ) : (
          <span className="size-9 shrink-0" aria-hidden="true" />
        )}
      </div>

      {showPeriodSelector ? <PeriodSelector locked={isBudgetTab} /> : null}
    </header>
  );
}
