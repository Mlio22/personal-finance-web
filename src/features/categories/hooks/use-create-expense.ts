"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryExpenseConfirmPayload } from "@/features/categories/components/category-expense-drawer";
import { createExpenseTransaction } from "@/features/categories/lib/create-expense";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CategoryExpenseConfirmPayload) =>
      createExpenseTransaction(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["accounts"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["overview"] });
      void queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
