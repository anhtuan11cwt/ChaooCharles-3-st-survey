import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_SECRET = new TextEncoder().encode(
	process.env.SESSION_SECRET ?? "fallback-secret-change-in-production",
);
const COOKIE_NAME = "session_token";

// Route không cần xác thực
const publicRoutes = [
	"/",
	"/sign-in",
	"/sign-up",
	"/api/auth/register",
	"/api/auth/login",
];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
		return NextResponse.next();
	}

	const token = request.cookies.get(COOKIE_NAME)?.value;
	let isAuthenticated = false;
	if (token) {
		try {
			await jwtVerify(token, SESSION_SECRET);
			isAuthenticated = true;
		} catch {}
	}

	// Đã đăng nhập thì chặn truy cập sign-in / sign-up
	if (isAuthenticated && (pathname === "/sign-in" || pathname === "/sign-up")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (publicRoutes.some((route) => pathname === route)) {
		return NextResponse.next();
	}

	if (isAuthenticated) {
		return NextResponse.next();
	}

	return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
	matcher: [
		{
			source:
				"/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
		},
	],
};
