import "server-only";
import type { User } from "@sdfc-loans/types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function createSession(token: string, user: User) {
  const cookieStore = await cookies();

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user");
}

export async function verifyJwt(token: string) {
  try {
    const key = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
