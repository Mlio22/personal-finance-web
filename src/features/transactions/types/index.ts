export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
}
