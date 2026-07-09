import type { Account } from "@/features/accounts/types";
import { AccountRow } from "@/features/accounts/components/account-row";
import { SavingsAccountRow } from "@/features/accounts/components/savings-account-row";
import { formatIdr } from "@/lib/format-currency";

interface AccountSectionProps {
  title: string;
  subtotal: number;
  accounts: Account[];
  variant: "regular" | "savings" | "investment";
  onAccountSelect?: (account: Account) => void;
  subtotalDecimals?: number;
}

export function AccountSection({
  title,
  subtotal,
  accounts,
  variant,
  onAccountSelect,
  subtotalDecimals,
}: AccountSectionProps) {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-0.5">
      <div className="flex items-baseline justify-between px-1 py-2">
        <h2 className="text-sm font-medium text-section">{title}</h2>
        <span className="text-sm font-semibold tabular-nums text-positive">
          {formatIdr(subtotal, {
            maximumFractionDigits: subtotalDecimals,
          })}
        </span>
      </div>

      <div>
        {accounts.map((account) =>
          variant === "savings" ||
          (variant === "investment" && account.isSavingsGoal) ? (
            <SavingsAccountRow
              key={account.id}
              account={account}
              onSelect={onAccountSelect}
            />
          ) : (
            <AccountRow
              key={account.id}
              account={account}
              onSelect={onAccountSelect}
            />
          ),
        )}
      </div>
    </section>
  );
}
