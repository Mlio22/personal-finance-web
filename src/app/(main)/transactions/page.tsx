import { Suspense } from "react";
import { TransactionsScreen } from "@/features/transactions/components/transactions-screen";
import { TransactionsSkeleton } from "@/features/transactions/components/transactions-skeleton";

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsScreen />
    </Suspense>
  );
}
