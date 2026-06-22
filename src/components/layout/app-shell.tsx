import { AccountFilterProvider } from "@/features/accounts/context/account-filter-provider";
import { PeriodProvider } from "@/features/period/context/period-provider";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AccountFilterProvider>
      <PeriodProvider>
        <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
          <OfflineIndicator />
          <InstallPrompt />
          <AppHeader />
          <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
          <BottomNav />
        </div>
      </PeriodProvider>
    </AccountFilterProvider>
  );
}
