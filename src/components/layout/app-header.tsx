"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AccountFilterSheet } from "@/features/accounts/components/account-filter-sheet";
import { PeriodSelector } from "@/features/period/components/period-selector";
import { UserSettingsDrawer } from "@/features/settings/components/user-settings-drawer";
import { useHeaderAction } from "@/components/layout/header-action-provider";
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
  const searchParams = useSearchParams();
  const { invokeAction } = useHeaderAction();
  const currentTab = getTabByPathname(pathname);
  const ActionIcon = currentTab?.actionIcon;
  const showPeriodSelector = currentTab
    ? PERIOD_SELECTOR_TABS.has(currentTab.id)
    : false;
  const isBudgetTab = currentTab?.id === "budget";
  const isAccountsTab = currentTab?.id === "accounts";
  const isCategoriesEdit =
    pathname === "/categories" && searchParams.get("edit") === "1";

  if (isCategoriesEdit) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className={cnHeader(isAccountsTab)}>
        <UserSettingsDrawer />

        <AccountFilterSheet />

        {ActionIcon ? (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full text-foreground"
            aria-label={currentTab.actionLabel}
            type="button"
            onClick={() => invokeAction(currentTab.id)}
          >
            <ActionIcon className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </Button>
        ) : (
          <span className="size-9 shrink-0" aria-hidden="true" />
        )}
      </div>

      {showPeriodSelector ? <PeriodSelector locked={isBudgetTab} /> : null}
    </header>
  );
}

function cnHeader(isAccountsTab: boolean) {
  return isAccountsTab
    ? "mx-auto flex h-16 max-w-lg items-center gap-2 px-3"
    : "mx-auto flex h-14 max-w-lg items-center gap-2 border-b border-border/60 px-3";
}
