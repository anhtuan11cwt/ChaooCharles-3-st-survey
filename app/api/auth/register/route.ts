import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Đăng ký tài khoản mới
export async function POST(request: Request) {
	const { email, password, name } = await request.json();

	if (!email || !password) {
		return NextResponse.json(
			{ error: "Email và mật khẩu là bắt buộc" },
			{ status: 400 },
		);
	}

	if (password.length < 6) {
		return NextResponse.json(
			{ error: "Mật khẩu phải có ít nhất 6 ký tự" },
			{ status: 400 },
		);
	}

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return NextResponse.json(
			{ error: "Email đã được sử dụng" },
			{ status: 409 },
		);
	}

	const passwordHash = await hashPassword(password);

	const user = await prisma.user.create({
		data: {
			email,
			name: name || null,
			password: passwordHash,
		},
	});

	await createSession(user.id);

	return NextResponse.json(
		{ user: { email: user.email, id: user.id, name: user.name } },
		{ status: 201 },
	);
}
