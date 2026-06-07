"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type User = {
	id: string;
	email: string;
	name: string | null;
};

export default function Navbar() {
	const router = useRouter();
	const pathname = usePathname();
	const [user, setUser] = useState<User | null>(null);
	const [mobileOpen, setMobileOpen] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-fetch user on route change
	useEffect(() => {
		fetch("/api/auth/me")
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => setUser(data?.user ?? null))
			.catch(() => setUser(null));
	}, [pathname]);

	async function handleSignOut() {
		await fetch("/api/auth/logout", { method: "POST" });
		setUser(null);
		toast.success("Đăng xuất thành công!");
		router.push("/sign-in");
		router.refresh();
	}

	return (
		<nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white sticky top-0 z-50 transition-all">
			<Link className="font-heading text-base font-medium shrink-0" href="/">
				Khảo sát 3 giai đoạn
			</Link>

			{/* Nút menu mobile */}
			<button
				aria-label="Menu"
				className="sm:hidden"
				onClick={() => setMobileOpen(!mobileOpen)}
				type="button"
			>
				{mobileOpen ? (
					<X className="size-5 text-[#426287]" />
				) : (
					<Menu className="size-5 text-[#426287]" />
				)}
			</button>

			{/* Menu mobile */}
			{mobileOpen && (
				<div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden flex z-50">
					<Link
						className={`block py-1 ${pathname === "/" ? "font-medium text-foreground" : ""}`}
						href="/"
					>
						Trang chủ
					</Link>
					<a
						className={`block py-1 ${pathname === "/survey" ? "font-medium text-foreground" : ""}`}
						href="/survey"
					>
						Khảo sát
					</a>

					{user ? (
						<>
							<span className="block py-1 text-muted-foreground">
								{user.name || user.email}
							</span>
							<button
								className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
								onClick={handleSignOut}
								type="button"
							>
								Đăng xuất
							</button>
						</>
					) : (
						<a href="/sign-in">
							<button
								className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
								type="button"
							>
								Đăng nhập
							</button>
						</a>
					)}
				</div>
			)}

			{/* Menu desktop */}
			<div className="hidden sm:flex items-center gap-8">
				<Link
					className={`text-sm transition-colors ${pathname === "/" ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
					href="/"
				>
					Trang chủ
				</Link>
				<a
					className={`text-sm transition-colors ${pathname === "/survey" ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
					href="/survey"
				>
					Khảo sát
				</a>

				{/* Tìm kiếm */}
				<div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
					<Input
						className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-auto px-0"
						placeholder="Tìm kiếm..."
						type="text"
					/>
					<Search className="size-4 shrink-0 text-gray-500" />
				</div>

				{user ? (
					<div className="flex items-center gap-3">
						<span className="text-sm text-muted-foreground">
							{user.name || user.email}
						</span>
						<Button onClick={handleSignOut} size="sm" variant="outline">
							Đăng xuất
						</Button>
					</div>
				) : (
					<Button asChild className="rounded-full px-8">
						<a href="/sign-in">Đăng nhập</a>
					</Button>
				)}
			</div>
		</nav>
	);
}
