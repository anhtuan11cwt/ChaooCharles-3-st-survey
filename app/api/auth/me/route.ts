import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Lấy thông tin user đang đăng nhập
export async function GET() {
	const user = await getCurrentUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return NextResponse.json({
		user: { email: user.email, id: user.id, name: user.name },
	});
}
