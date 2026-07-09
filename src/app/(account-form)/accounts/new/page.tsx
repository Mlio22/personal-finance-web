import type { Metadata } from "next";
import { AccountFormPage } from "@/features/accounts/components/account-form-page";
import type { AccountType } from "@/features/accounts/types";

export const metadata: Metadata = {
  title: "New account",
};

const VALID_TYPES = new Set<AccountType>([
  "regular",
  "debt",
  "savings",
  "investment",
]);

export default async function NewAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const typeParam = params.type;
  const initialType =
    typeParam && VALID_TYPES.has(typeParam as AccountType)
      ? (typeParam as AccountType)
      : "regular";

  return <AccountFormPage mode="create" initialType={initialType} />;
}
