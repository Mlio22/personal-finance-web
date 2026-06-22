"use client";

import type { AccountsSubTab } from "@/features/accounts/types";
import { cn } from "@/lib/utils";

const SUB_TABS: { id: AccountsSubTab; label: string }[] = [
  { id: "accounts", label: "Accounts" },
  { id: "debts", label: "Debts" },
  { id: "my-finances", label: "My finances" },
];

interface AccountsSubNavProps {
  activeTab: AccountsSubTab;
  onTabChange: (tab: AccountsSubTab) => void;
}

export function AccountsSubNav({ activeTab, onTabChange }: AccountsSubNavProps) {
  return (
    <nav
      aria-label="Accounts sections"
      className="-mx-4 mb-4 border-b border-border/60 px-4"
    >
      <div className="flex gap-6">
        {SUB_TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
              {isActive ? (
                <span
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-sky-400"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
