import { ArrowRightLeft, CreditCard, PiggyBank } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";

const quickActions = [
  {
    title: "Accounts",
    description: "View and manage your financial accounts.",
    href: "/accounts",
    icon: PiggyBank,
  },
  {
    title: "Transactions",
    description: "Track income, expenses, and transfers.",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    title: "Cards",
    description: "Monitor credit and debit card activity.",
    href: "/accounts",
    icon: CreditCard,
  },
] as const;

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Overview of your personal finances. Connect the backend API to see live
          balances and activity.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Summary</h2>
        <DashboardSummaryCards />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <action.icon className="size-4" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" size="sm" render={<Link href={action.href} />}>
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
