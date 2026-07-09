"use client";

import {
  ArrowUpDown,
  FileSpreadsheet,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { AccountsSubTab } from "@/features/accounts/types";
import { cn } from "@/lib/utils";

const SUB_TABS: { id: AccountsSubTab; label: string; icon: LucideIcon }[] = [
  { id: "accounts", label: "Accounts", icon: Wallet },
  { id: "debts", label: "Debts", icon: ArrowUpDown },
  { id: "my-finances", label: "My finances", icon: FileSpreadsheet },
];

interface AccountsSubNavProps {
  activeTab: AccountsSubTab;
  onTabChange: (tab: AccountsSubTab) => void;
}

export function AccountsSubNav({ activeTab, onTabChange }: AccountsSubNavProps) {
  return (
    <nav
      aria-label="Accounts sections"
      className="-mx-4 mb-3 border-b border-border/50 px-4"
    >
      <div className="flex">
        {SUB_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1.5 pb-3 pt-1 text-[0.7rem] font-medium transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              <span>{tab.label}</span>
              {isActive ? (
                <span
                  className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-accent-violet"
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
