import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("access_token");
  const { pathname } = req.nextUrl;

  // Skip API routes
  if (pathname.startsWith("/api")) return NextResponse.next();

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname !== "/login" && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname !== "/login" && accessToken) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken.value}` },
    });

    if (res.status === 401) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard",
    "/quiz",
    "/quiz/:path",
    "/quiz/detail/:path",
    "/profile",
    "/profile/:path",
    "/subtests",
    "/",
  ],
};
