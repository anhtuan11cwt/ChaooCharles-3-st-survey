"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		const res = await fetch("/api/auth/login", {
			body: JSON.stringify({ email, password }),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});

		if (!res.ok) {
			const data = await res.json();
			toast.error(data.error || "Đăng nhập thất bại");
			setLoading(false);
			return;
		}

		toast.success("Đăng nhập thành công!");
		router.push("/");
		router.refresh();
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Đăng nhập</CardTitle>
					<CardDescription>Nhập email và mật khẩu để tiếp tục</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									disabled={loading}
									id="email"
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									required
									type="email"
									value={email}
								/>
							</Field>

							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
									<button
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
										disabled={loading}
										onClick={() => {}}
										type="button"
									>
										Quên mật khẩu?
									</button>
								</div>
								<div className="relative">
									<Input
										className="pr-10"
										disabled={loading}
										id="password"
										onChange={(e) => setPassword(e.target.value)}
										required
										type={showPassword ? "text" : "password"}
										value={password}
									/>
									<Button
										className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
										disabled={loading}
										onClick={() => setShowPassword(!showPassword)}
										size="icon"
										tabIndex={-1}
										type="button"
										variant="ghost"
									>
										{showPassword ? (
											<EyeOff className="size-4" />
										) : (
											<Eye className="size-4" />
										)}
									</Button>
								</div>
							</Field>

							<Field>
								<Button disabled={loading} type="submit">
									{loading ? "Đang xử lý..." : "Đăng nhập"}
								</Button>
								<FieldDescription
									className={cn(
										"text-center",
										loading && "pointer-events-none opacity-50",
									)}
								>
									Chưa có tài khoản? <a href="/sign-up">Đăng ký</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
