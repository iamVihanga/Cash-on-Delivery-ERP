import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "core/auth/config";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified"
];

const protectedRoutes = ["/admin", "/account"];

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    return NextResponse.next();
  }
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  if (authRoutes.includes(pathname) || isProtectedPath) {
    console.log("sdwddwd");
    // Fetch session
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        // baseURL: request.nextUrl.origin,
        baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
        // baseURL: 'http://localhost:4000',
        headers: {
          //get the cookie from the request
          cookie: request.headers.get("cookie") || ""
        }
      }
    );

    // If Auth route and Already authenticated,
    // Redirect back to appropiate path
    if (authRoutes.includes(pathname) && session) {
      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (session.user.role === "user") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    }

    // If protected route and Not authenticated,
    // Redirect back to signin
    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // If authenticated, and trying to access '/account'
    if (session && pathname.startsWith("/account")) {
      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    // If authenticated, and trying to access '/admin'
    if (session && pathname.startsWith("/admin")) {
      if (session.user.role === "admin") {
        return NextResponse.next();
      }

      if (session.user.role === "user") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"
    // Always run for API routes
    // "/(api|trpc)(.*)"
  ]
};
