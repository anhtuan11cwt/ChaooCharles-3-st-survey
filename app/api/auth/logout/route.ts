import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

// Đăng xuất
export async function POST() {
	await deleteSession();
	return NextResponse.json({ success: true });
}
