"use client";

import { AveragesSection } from "@/features/overview/components/averages-section";
import { BalanceRow } from "@/features/overview/components/balance-row";
import { BudgetFooter } from "@/features/overview/components/budget-footer";
import { CategoryBreakdownList } from "@/features/overview/components/category-breakdown-list";
import { DailyActivityChart } from "@/features/overview/components/daily-activity-chart";
import { IncomeExpenseCards } from "@/features/overview/components/income-expense-cards";
import { OverviewSkeleton } from "@/features/overview/components/overview-skeleton";
import { useOverview } from "@/features/categories/hooks/use-overview";

export function OverviewScreen() {
  const { data, isLoading } = useOverview();

  if (isLoading || !data) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="space-y-6 pb-2">
      <BalanceRow
        balance={data.balance}
        notificationCount={data.notificationCount}
      />

      <IncomeExpenseCards expenses={data.expenses} income={data.income} />

      <DailyActivityChart dailyBreakdown={data.dailyBreakdown} />

      <AveragesSection averages={data.averages} />

      <CategoryBreakdownList categories={data.categoryBreakdown} />

      <BudgetFooter budgetRemaining={data.budgetRemaining} />
    </div>
  );
}
