import type { Account } from "@/features/accounts/types";

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: "cash",
    name: "Cash",
    balance: 1_200_000,
    currency: "IDR",
    color: "#4ade80",
  },
  {
    id: "bca",
    name: "BCA",
    balance: 752_871,
    currency: "IDR",
    color: "#60a5fa",
  },
  {
    id: "gopay",
    name: "GoPay",
    balance: 0,
    currency: "IDR",
    color: "#38bdf8",
  },
];

export const ALL_ACCOUNTS_FILTER_ID = "all";

export function getTotalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
}
