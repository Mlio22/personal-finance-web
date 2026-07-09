import type { Account, AccountsResponse } from "@/features/accounts/types";

export const MOCK_ACCOUNTS_RESPONSE: AccountsResponse = {
  accounts: [
    {
      id: "cash",
      name: "Cash",
      balance: 101_000,
      currency: "IDR",
      type: "regular",
      color: "#14B8A6",
      icon: "wallet",
      isDefault: true,
      sortOrder: 1,
    },
    {
      id: "jenius",
      name: "Jenius (BTPN)",
      balance: 65_508,
      currency: "IDR",
      type: "regular",
      color: "#3B82F6",
      icon: "card",
      sortOrder: 2,
    },
    {
      id: "dana",
      name: "Dana",
      balance: 15_405,
      currency: "IDR",
      type: "regular",
      color: "#22D3EE",
      icon: "wallet",
      sortOrder: 3,
    },
    {
      id: "mandiri",
      name: "Bank Mandiri",
      balance: 827_646,
      currency: "IDR",
      type: "regular",
      color: "#0EA5E9",
      icon: "card",
      sortOrder: 4,
    },
    {
      id: "jago",
      name: "Bank Jago",
      balance: 20_000,
      currency: "IDR",
      type: "regular",
      color: "#FACC15",
      icon: "card",
      sortOrder: 5,
    },
    {
      id: "ocbc",
      name: "OCBC",
      balance: 2_132_356,
      currency: "IDR",
      type: "regular",
      color: "#EC4899",
      icon: "card",
      sortOrder: 6,
    },
    {
      id: "boc",
      name: "Bank of China",
      balance: 1_000_000,
      currency: "IDR",
      type: "regular",
      color: "#EF4444",
      icon: "card",
      sortOrder: 7,
    },
  ],
  savings: [
    {
      id: "tabungan-darurat-bca",
      name: "Tabungan darurat (BCA)",
      balance: 4_520_000,
      currency: "IDR",
      type: "savings",
      color: "#374151",
      icon: "sos",
      isSavingsGoal: true,
      savingsTarget: 7_000_000,
      sortOrder: 1,
    },
    {
      id: "jalan-jalan",
      name: "Jalan Jalan",
      balance: 0,
      currency: "IDR",
      type: "savings",
      color: "#EC4899",
      icon: "travel",
      isSavingsGoal: true,
      savingsTarget: 25_000_000,
      goalLabel: "Goal: Japan (Feb / Apr 2027)",
      sortOrder: 2,
    },
    {
      id: "tabungan-qurban",
      name: "Tabungan Qurban",
      balance: 0,
      currency: "IDR",
      type: "savings",
      color: "#F59E0B",
      icon: "qurban",
      isSavingsGoal: true,
      savingsTarget: 3_000_000,
      goalLabel: "12 months left",
      sortOrder: 3,
    },
    {
      id: "tabungan-emas",
      name: "Tabungan emas",
      balance: 2,
      currency: "XAUg",
      type: "savings",
      color: "#FACC15",
      icon: "gold",
      sortOrder: 4,
    },
  ],
  investments: [
    {
      id: "bibit-cash",
      name: "Investasi bibit (cash / RDN)",
      balance: 21_435,
      currency: "IDR",
      type: "investment",
      color: "#10B981",
      icon: "cash",
      sortOrder: 1,
    },
    {
      id: "bibit-pasar-uang",
      name: "Akumulasi bibit pasar uang (darurat)",
      balance: 15_202_087,
      currency: "IDR",
      type: "investment",
      color: "#10B981",
      icon: "sparkle",
      sortOrder: 2,
    },
    {
      id: "bibit-obligasi",
      name: "Akumulasi bibit obligasi",
      balance: 1_965_740,
      currency: "IDR",
      type: "investment",
      color: "#10B981",
      icon: "vault",
      isSavingsGoal: true,
      savingsTarget: 10_000_000,
      sortOrder: 3,
    },
    {
      id: "bibit-saham",
      name: "Akumulasi Investasi bibit saham",
      balance: 936_555,
      currency: "IDR",
      type: "investment",
      color: "#10B981",
      icon: "chart",
      sortOrder: 4,
    },
    {
      id: "net-bibit",
      name: "NET Bibit",
      balance: 0,
      currency: "IDR",
      type: "investment",
      color: "#10B981",
      icon: "bars",
      sortOrder: 5,
    },
    {
      id: "pluang-cash",
      name: "Investasi Pluang (cash)",
      balance: 45_247,
      currency: "IDR",
      type: "investment",
      color: "#10B981",
      icon: "cash",
      sortOrder: 6,
    },
    {
      id: "pluang-cash-usd",
      name: "Investasi Pluang (cash USD)",
      balance: 0,
      currency: "USD",
      type: "investment",
      color: "#FACC15",
      icon: "dollar",
      sortOrder: 7,
    },
    {
      id: "pluang-emas",
      name: "Investasi Pluang (emas)",
      balance: 6_127_128,
      currency: "IDR",
      type: "investment",
      color: "#F59E0B",
      icon: "gold",
      sortOrder: 8,
    },
    {
      id: "pluang-saham",
      name: "Akumulasi Saham Pluang",
      balance: 0.66,
      currency: "USD",
      type: "investment",
      color: "#374151",
      icon: "vault",
      sortOrder: 9,
    },
    {
      id: "pluang-btc",
      name: "Investasi Pluang (BTC)",
      balance: 0,
      currency: "IDR",
      type: "investment",
      color: "#F97316",
      icon: "vault",
      sortOrder: 10,
    },
  ],
  archived: [],
  totals: {
    accounts: 4_161_915,
    savings: 4_520_002,
    investments: 24_298_192.66,
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
