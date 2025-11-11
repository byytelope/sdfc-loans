import type { User } from "@sdfc-loans/types";
import { cookies } from "next/headers";

import { EmptyLoans } from "@/components/empty-loans";
import { HomeHeader } from "@/components/home-header";
import { LoansTable } from "@/components/loans-table";
import { getLoanItems } from "@/lib/actions";

export default async function Home() {
  const userString = (await cookies()).get("user")?.value;
  const user = JSON.parse(userString ?? "") as User;

  const loanItems = await getLoanItems();

  return (
    <div className="flex flex-col p-8 gap-8">
      <HomeHeader userName={user.name} />
      {loanItems.length > 0 ? (
        <LoansTable isAdmin={user.isAdmin} loanItems={loanItems} />
      ) : (
        <EmptyLoans />
      )}
    </div>
  );
}
