import { type NextRequest, NextResponse } from "next/server";

import { verifyJwt } from "@/lib/session";

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
