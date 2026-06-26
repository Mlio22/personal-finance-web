"use client";

import { formatIdr } from "@/lib/format-currency";
import { PendingNotificationsDrawer } from "@/features/overview/components/pending-notifications-drawer";

interface BalanceRowProps {
  balance: number;
  notificationCount: number;
}

export function BalanceRow({ balance, notificationCount }: BalanceRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-label">Balance</p>
        <p className="text-amount text-positive">
          {formatIdr(balance, { maximumFractionDigits: 2 })}
        </p>
      </div>

      <PendingNotificationsDrawer count={notificationCount} />
    </div>
  );
}
