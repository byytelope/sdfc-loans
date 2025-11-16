import type { User } from "@sdfc-loans/types";
import { cookies } from "next/headers";

import { EmptyPayments } from "@/components/payments-table/empty-payments";
import { PaymentsTable } from "@/components/payments-table/payments-table";
import { getPayments } from "@/lib/actions";

export const PaymentsTableWrapper = async () => {
  const userString = (await cookies()).get("user")?.value;
  const user = JSON.parse(userString ?? "{}") as User;
  const paymentItemsRes = await getPayments();

  if (!paymentItemsRes.success || paymentItemsRes.data.length === 0) {
    return <EmptyPayments isAdmin={user.isAdmin} />;
  }

  return (
    <PaymentsTable isAdmin={user.isAdmin} paymentItems={paymentItemsRes.data} />
  );
};
