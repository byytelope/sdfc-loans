import type { User } from "@sdfc-loans/types";
import { cookies } from "next/headers";

import { EmptyLoans } from "@/components/loans-table/empty-loans";
import { LoansTable } from "@/components/loans-table/loans-table";
import { getLoans } from "@/lib/actions";

export const LoansTableWrapper = async () => {
  const userString = (await cookies()).get("user")?.value;
  const user = JSON.parse(userString ?? "{}") as User;
  const loanItemsRes = await getLoans();

  if (!loanItemsRes.success || loanItemsRes.data.length === 0) {
    return <EmptyLoans isAdmin={user.isAdmin} />;
  }

  return <LoansTable isAdmin={user.isAdmin} loanItems={loanItemsRes.data} />;
};
