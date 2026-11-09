import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * On HTTPS (production) Auth.js names the session cookie `__Secure-authjs.session-token`.
 * `getToken` only looks for that name when `secureCookie` is true, so it must be
 * set explicitly or every signed-in admin is bounced back to the login page.
 */
function isSecureRequest(request: NextRequest): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return request.nextUrl.protocol === "https:";
}

async function readToken(request: NextRequest) {
  return getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecureRequest(request),
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await readToken(request);
    if (!token) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname === "/admin/login") {
    const token = await readToken(request);
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
