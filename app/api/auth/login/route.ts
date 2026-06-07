import { NextResponse } from "next/server";
import { comparePassword, createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Đăng nhập
export async function POST(request: Request) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email và mật khẩu là bắt buộc" },
			{ status: 400 },
		);
	}

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return NextResponse.json(
			{ error: "Email hoặc mật khẩu không đúng" },
			{ status: 401 },
		);
	}

	const isValid = await comparePassword(password, user.password);
	if (!isValid) {
		return NextResponse.json(
			{ error: "Email hoặc mật khẩu không đúng" },
			{ status: 401 },
		);
	}

	await createSession(user.id);

	return NextResponse.json({
		user: { email: user.email, id: user.id, name: user.name },
	});
}
