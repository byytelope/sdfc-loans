import type { User } from "@sdfc-loans/types";
import { cookies } from "next/headers";

export const UserName = async () => {
  const userString = (await cookies()).get("user")?.value;
  const user = JSON.parse(userString ?? "{}") as User;

  return <span className="text-muted-foreground">{user?.name ?? "User"}</span>;
};
