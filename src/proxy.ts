import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname === "/login" && session?.accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (pathname !== "/login" && !session?.accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard",
    "/quiz",
    "/quiz/:path",
    "/profile",
    "/profile/:path",
    "/subtests",
    "/",
  ],
};
