// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/contacts", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuth && request.nextUrl.pathname.startsWith("/contacts")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/contacts/:path*", "/auth/:path*"],
};