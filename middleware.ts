import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
const publicAuthRoutes = ["/signin", "/signup"];

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      const { payload } = await jwtVerify(token, secret);

      if (payload.exp && Date.now() >= payload.exp * 1000) {
        console.error("Token expired");
        return NextResponse.redirect(new URL("/signin?expired=true", req.url));
      }

      if (publicAuthRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (protectedRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
      }
    } else {
      if (protectedRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/signin", req.url));
      }
    }
  } catch (err) {
    console.error("Token verification failed:", err);

    if (protectedRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/signin", "/signup", "/dashboard/:path*"],
};
