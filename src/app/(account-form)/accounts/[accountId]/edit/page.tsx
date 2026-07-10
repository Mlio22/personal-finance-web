import type { Metadata } from "next";
import { AccountFormPage } from "@/features/accounts/components/account-form-page";

export const metadata: Metadata = {
  title: "Edit account",
};

export default async function EditAccountPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;

  return <AccountFormPage mode="edit" accountId={accountId} />;
}
