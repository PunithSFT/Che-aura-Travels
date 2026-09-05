// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protect these routes
  const protectedRoutes = ["/packages", "/customize-tour"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      // Redirect to login with a return URL
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/packages/:path*", "/customize-tour/:path*"],
};