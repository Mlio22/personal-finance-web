import type { Metadata } from "next";
import { AccountFormPage } from "@/features/accounts/components/account-form-page";
import type { AccountType } from "@/features/accounts/types";

export const metadata: Metadata = {
  title: "New account",
};

const VALID_TYPES = new Set<AccountType>(["regular", "debt", "savings"]);

export default async function NewAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const typeParam = params.type;
  // Treat legacy ?type=investment as savings for now.
  const normalizedType =
    typeParam === "investment" ? "savings" : (typeParam as AccountType | undefined);
  const initialType =
    normalizedType && VALID_TYPES.has(normalizedType)
      ? normalizedType
      : "regular";

  return <AccountFormPage mode="create" initialType={initialType} />;
}
