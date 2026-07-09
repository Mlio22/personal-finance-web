"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AccountFormScreen } from "@/features/accounts/components/account-form-screen";
import {
  accountToFormValues,
  applyFormValuesToAccount,
  createAccountFromForm,
  defaultFormValues,
  deleteAccountFromMockCache,
  findAccountById,
  getClientMockAccountsResponse,
  upsertAccountInMockCache,
} from "@/features/accounts/lib/account-store";
import type {
  Account,
  AccountFormMode,
  AccountFormValues,
  AccountType,
} from "@/features/accounts/types";

interface AccountFormPageProps {
  mode: AccountFormMode;
  accountId?: string;
  initialType?: AccountType;
}

export function AccountFormPage({
  mode,
  accountId,
  initialType = "regular",
}: AccountFormPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(mode === "create");
  const [existingAccount, setExistingAccount] = useState<Account | undefined>();

  useEffect(() => {
    if (mode !== "edit" || !accountId) {
      setReady(true);
      return;
    }

    const account = findAccountById(
      getClientMockAccountsResponse(),
      accountId,
    );
    setExistingAccount(account);
    setReady(true);
  }, [mode, accountId]);

  function handleClose() {
    router.back();
  }

  function invalidateAccountQueries() {
    void queryClient.invalidateQueries({ queryKey: ["accounts"] });
    void queryClient.invalidateQueries({ queryKey: ["overview"] });
    void queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }

  function handleSubmit(values: AccountFormValues) {
    if (mode === "edit" && existingAccount) {
      upsertAccountInMockCache(
        applyFormValuesToAccount(existingAccount, values),
      );
    } else {
      upsertAccountInMockCache(createAccountFromForm(values));
    }

    invalidateAccountQueries();
    router.push("/accounts");
  }

  function handleDelete() {
    if (!existingAccount) return;
    deleteAccountFromMockCache(existingAccount.id);
    invalidateAccountQueries();
    router.push("/accounts");
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-8 space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-16 w-full animate-pulse rounded bg-muted" />
          <div className="h-16 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (mode === "edit" && !existingAccount) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="text-sm font-medium text-foreground">Account not found</p>
        <p className="text-sm text-muted-foreground">
          This account may have been removed or is unavailable offline.
        </p>
        <button
          type="button"
          className="mt-2 text-sm font-medium text-section underline-offset-4 hover:underline"
          onClick={() => router.push("/accounts")}
        >
          Back to accounts
        </button>
      </div>
    );
  }

  const initialValues =
    mode === "edit" && existingAccount
      ? accountToFormValues(existingAccount)
      : defaultFormValues(initialType);

  return (
    <AccountFormScreen
      mode={mode}
      initialValues={initialValues}
      account={existingAccount}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onDelete={mode === "edit" ? handleDelete : undefined}
    />
  );
}
