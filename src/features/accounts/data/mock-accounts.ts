import type { Account, AccountsResponse } from "@/features/accounts/types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Whole IDR amounts with optional rounding step for more natural-looking balances. */
function randomIdr(min: number, max: number, step = 1): number {
  const low = Math.floor(min / step);
  const high = Math.floor(max / step);
  return randomInt(low, high) * step;
}

function randomUsd(min: number, max: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return randomInt(Math.round(min * factor), Math.round(max * factor)) / factor;
}

function maybeZero(chance = 0.25): boolean {
  return Math.random() < chance;
}

function sumIdrBalances(accounts: Account[]): number {
  return accounts.reduce((sum, account) => {
    if (account.currency !== "IDR") {
      return sum;
    }
    if (account.includeInTotalBalance === false) {
      return sum;
    }
    return sum + account.balance;
  }, 0);
}

function createMockAccounts(): Account[] {
  return [
    {
      id: "cash",
      name: "Cash",
      balance: randomIdr(50_000, 500_000, 1_000),
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
      balance: randomIdr(10_000, 2_000_000, 1),
      currency: "IDR",
      type: "regular",
      color: "#3B82F6",
      icon: "card",
      sortOrder: 2,
    },
    {
      id: "dana",
      name: "Dana",
      balance: randomIdr(5_000, 250_000, 1),
      currency: "IDR",
      type: "regular",
      color: "#22D3EE",
      icon: "wallet",
      sortOrder: 3,
    },
    {
      id: "mandiri",
      name: "Bank Mandiri",
      balance: randomIdr(100_000, 5_000_000, 1),
      currency: "IDR",
      type: "regular",
      color: "#0EA5E9",
      icon: "card",
      sortOrder: 4,
    },
    {
      id: "jago",
      name: "Bank Jago",
      balance: randomIdr(0, 500_000, 1_000),
      currency: "IDR",
      type: "regular",
      color: "#FACC15",
      icon: "card",
      sortOrder: 5,
    },
    {
      id: "ocbc",
      name: "OCBC",
      balance: randomIdr(200_000, 8_000_000, 1),
      currency: "IDR",
      type: "regular",
      color: "#EC4899",
      icon: "card",
      sortOrder: 6,
    },
    {
      id: "boc",
      name: "Bank of China",
      balance: randomIdr(100_000, 3_000_000, 1_000),
      currency: "IDR",
      type: "regular",
      color: "#EF4444",
      icon: "card",
      sortOrder: 7,
    },
  ];
}

function createMockSavings(): Account[] {
  const emergencyTarget = randomIdr(5_000_000, 15_000_000, 100_000);
  const travelTarget = randomIdr(15_000_000, 40_000_000, 1_000_000);
  const qurbanTarget = randomIdr(2_000_000, 8_000_000, 100_000);

  const emergencyBalance = randomIdr(
    Math.floor(emergencyTarget * 0.2),
    emergencyTarget,
    1_000,
  );
  const travelBalance = maybeZero(0.4)
    ? 0
    : randomIdr(100_000, Math.floor(travelTarget * 0.6), 1_000);
  const qurbanBalance = maybeZero(0.5)
    ? 0
    : randomIdr(50_000, Math.floor(qurbanTarget * 0.7), 1_000);

  return [
    {
      id: "tabungan-darurat-bca",
      name: "Tabungan darurat (BCA)",
      balance: emergencyBalance,
      currency: "IDR",
      type: "savings",
      color: "#374151",
      icon: "sos",
      isSavingsGoal: true,
      savingsTarget: emergencyTarget,
      sortOrder: 1,
    },
    {
      id: "jalan-jalan",
      name: "Jalan Jalan",
      balance: travelBalance,
      currency: "IDR",
      type: "savings",
      color: "#EC4899",
      icon: "travel",
      isSavingsGoal: true,
      savingsTarget: travelTarget,
      goalLabel: "Goal: Japan (Feb / Apr 2027)",
      sortOrder: 2,
    },
    {
      id: "tabungan-qurban",
      name: "Tabungan Qurban",
      balance: qurbanBalance,
      currency: "IDR",
      type: "savings",
      color: "#F59E0B",
      icon: "qurban",
      isSavingsGoal: true,
      savingsTarget: qurbanTarget,
      goalLabel: `${randomInt(3, 18)} months left`,
      sortOrder: 3,
    },
    {
      id: "tabungan-emas",
      name: "Tabungan emas",
      balance: randomInt(1, 12),
      currency: "XAUg",
      type: "savings",
      color: "#FACC15",
      icon: "gold",
      sortOrder: 4,
    },
  ];
}

/** Former investment accounts — treated as savings for now. */
function createMockInvestmentAsSavings(): Account[] {
  const obligasiTarget = randomIdr(5_000_000, 20_000_000, 100_000);
  const obligasiBalance = randomIdr(
    Math.floor(obligasiTarget * 0.05),
    Math.floor(obligasiTarget * 0.8),
    1_000,
  );

  return [
    {
      id: "bibit-cash",
      name: "Investasi bibit (cash / RDN)",
      balance: randomIdr(5_000, 500_000, 1),
      currency: "IDR",
      type: "savings",
      color: "#10B981",
      icon: "cash",
      sortOrder: 101,
    },
    {
      id: "bibit-pasar-uang",
      name: "Akumulasi bibit pasar uang (darurat)",
      balance: randomIdr(1_000_000, 25_000_000, 1),
      currency: "IDR",
      type: "savings",
      color: "#10B981",
      icon: "sparkle",
      sortOrder: 102,
    },
    {
      id: "bibit-obligasi",
      name: "Akumulasi bibit obligasi",
      balance: obligasiBalance,
      currency: "IDR",
      type: "savings",
      color: "#10B981",
      icon: "vault",
      isSavingsGoal: true,
      savingsTarget: obligasiTarget,
      sortOrder: 103,
    },
    {
      id: "bibit-saham",
      name: "Akumulasi Investasi bibit saham",
      balance: randomIdr(100_000, 5_000_000, 1),
      currency: "IDR",
      type: "savings",
      color: "#10B981",
      icon: "chart",
      sortOrder: 104,
    },
    {
      id: "net-bibit",
      name: "NET Bibit",
      balance: maybeZero(0.6) ? 0 : randomIdr(10_000, 1_000_000, 1),
      currency: "IDR",
      type: "savings",
      color: "#10B981",
      icon: "bars",
      sortOrder: 105,
    },
    {
      id: "pluang-cash",
      name: "Investasi Pluang (cash)",
      balance: randomIdr(10_000, 500_000, 1),
      currency: "IDR",
      type: "savings",
      color: "#10B981",
      icon: "cash",
      sortOrder: 106,
    },
    {
      id: "pluang-cash-usd",
      name: "Investasi Pluang (cash USD)",
      balance: maybeZero(0.5) ? 0 : randomUsd(1, 250),
      currency: "USD",
      type: "savings",
      color: "#FACC15",
      icon: "dollar",
      sortOrder: 107,
    },
    {
      id: "pluang-emas",
      name: "Investasi Pluang (emas)",
      balance: randomIdr(500_000, 12_000_000, 1),
      currency: "IDR",
      type: "savings",
      color: "#F59E0B",
      icon: "gold",
      sortOrder: 108,
    },
    {
      id: "pluang-saham",
      name: "Akumulasi Saham Pluang",
      balance: maybeZero(0.3) ? 0 : randomUsd(0.1, 50),
      currency: "USD",
      type: "savings",
      color: "#374151",
      icon: "vault",
      sortOrder: 109,
    },
    {
      id: "pluang-btc",
      name: "Investasi Pluang (BTC)",
      balance: maybeZero(0.55) ? 0 : randomIdr(50_000, 3_000_000, 1),
      currency: "IDR",
      type: "savings",
      color: "#F97316",
      icon: "vault",
      sortOrder: 110,
    },
  ];
}

/** Empty shell used during SSR to avoid hydration mismatches from Math.random(). */
export const EMPTY_ACCOUNTS_RESPONSE: AccountsResponse = {
  accounts: [],
  savings: [],
  investments: [],
  archived: [],
  totals: {
    accounts: 0,
    savings: 0,
    investments: 0,
  },
};

/** Build a fresh randomized mock dataset. */
export function createMockAccountsResponse(): AccountsResponse {
  const accounts = createMockAccounts();
  const savings = [
    ...createMockSavings(),
    ...createMockInvestmentAsSavings(),
  ];
  const investments: Account[] = [];
  const archived: Account[] = [];

  return {
    accounts,
    savings,
    investments,
    archived,
    totals: {
      accounts: sumIdrBalances(accounts),
      savings: sumIdrBalances(savings),
      investments: 0,
    },
  };
}

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
