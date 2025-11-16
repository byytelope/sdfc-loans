import { Suspense } from "react";

import { LogoutButton } from "@/components/home-header/logout-button";
import { UserName } from "@/components/home-header/user-name";
import { LoansTableSkeleton } from "@/components/loans-table/loans-table-skeleton";
import { LoansTableWrapper } from "@/components/loans-table/loans-table-wrapper";
import { PaymentsTableSkeleton } from "@/components/payments-table/payments-table-skeleton";
import { PaymentsTableWrapper } from "@/components/payments-table/payments-table-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col p-8 gap-8 min-h-screen">
      <div className="flex justify-between">
        <div>
          <h1 className="font-medium text-xl">Loan Facilities Dashboard</h1>
          <Suspense fallback={<Skeleton className="w-12 h-4" />}>
            <UserName />
          </Suspense>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>

      <Tabs defaultValue="loans">
        <TabsList>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
          <Suspense fallback={<LoansTableSkeleton />}>
            <LoansTableWrapper />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments">
          <Suspense fallback={<PaymentsTableSkeleton />}>
            <PaymentsTableWrapper />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
