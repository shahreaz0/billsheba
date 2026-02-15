import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const protectedRoutes = [
  "/dashboard",
  "/customers",
  "/organizations",
  "/packages",
  "/payments",
  "/users",
  "/settings",
]

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, "") || "/"
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "")

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token && ["/", "/login"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard",
    "/customers/:path*",
    "/organizations/:path*",
    "/packages/:path*",
    "/payments/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
}
