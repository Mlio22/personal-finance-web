import { AccountFilterProvider } from "@/features/accounts/context/account-filter-provider";
import { PeriodProvider } from "@/features/period/context/period-provider";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { HeaderActionProvider } from "@/components/layout/header-action-provider";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AccountFilterProvider>
      <PeriodProvider>
        <HeaderActionProvider>
          <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden bg-background">
            <OfflineIndicator />
            <InstallPrompt />
            <AppHeader />
            <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
              {children}
            </main>
            <BottomNav />
          </div>
        </HeaderActionProvider>
      </PeriodProvider>
    </AccountFilterProvider>
  );
}
