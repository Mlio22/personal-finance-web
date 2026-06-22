import type { Account, AccountsResponse } from "@/features/accounts/types";

export const MOCK_ACCOUNTS_RESPONSE: AccountsResponse = {
  accounts: [
    {
      id: "cash",
      name: "Cash",
      balance: 133_000,
      currency: "IDR",
      type: "regular",
      color: "#2dd4bf",
      isDefault: true,
      sortOrder: 1,
    },
    {
      id: "jenius",
      name: "Jenius (BTPN)",
      balance: 65_508,
      currency: "IDR",
      type: "regular",
      color: "#60a5fa",
      sortOrder: 2,
    },
    {
      id: "dana",
      name: "Dana",
      balance: 15_405,
      currency: "IDR",
      type: "regular",
      color: "#22d3ee",
      sortOrder: 3,
    },
    {
      id: "mandiri",
      name: "Bank Mandiri",
      balance: 438_016,
      currency: "IDR",
      type: "regular",
      color: "#3b82f6",
      sortOrder: 4,
    },
    {
      id: "jago",
      name: "Bank Jago",
      balance: 20_000,
      currency: "IDR",
      type: "regular",
      color: "#facc15",
      sortOrder: 5,
    },
    {
      id: "ocbc",
      name: "OCBC",
      balance: 1_280_942,
      currency: "IDR",
      type: "regular",
      color: "#f472b6",
      sortOrder: 6,
    },
  ],
  savings: [
    {
      id: "tabungan-bca",
      name: "Tabungan (BCA)",
      balance: 1_050_000,
      currency: "IDR",
      type: "savings",
      color: "#60a5fa",
      isSavingsGoal: true,
      savingsTarget: 3_530_000,
      sortOrder: 1,
    },
    {
      id: "bibit-darurat",
      name: "Akumulasi bibit pasar uang (darurat)",
      balance: 13_424_905,
      currency: "IDR",
      type: "savings",
      color: "#4ade80",
      isSavingsGoal: true,
      savingsTarget: 15_000_000,
      sortOrder: 2,
    },
  ],
  totals: {
    accounts: 1_952_871,
    savings: 31_850_406.81,
  },
};

/** Regular (non-savings) accounts for the header account filter. */
export const MOCK_ACCOUNTS: Account[] = MOCK_ACCOUNTS_RESPONSE.accounts;

export const ALL_ACCOUNTS_FILTER_ID = "all";

export function getTotalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, account) => sum + account.balance, 0);
}

export function getSavingsProgress(account: Account): number {
  if (!account.savingsTarget || account.savingsTarget <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((account.balance / account.savingsTarget) * 100),
  );
}

export function getSavingsRemaining(account: Account): number {
  if (!account.savingsTarget) {
    return 0;
  }

  return Math.max(0, account.savingsTarget - account.balance);
}
