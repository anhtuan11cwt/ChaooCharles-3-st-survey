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

export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Mật khẩu xác nhận không khớp");
			return;
		}

		if (password.length < 6) {
			toast.error("Mật khẩu phải có ít nhất 6 ký tự");
			return;
		}

		setLoading(true);

		const res = await fetch("/api/auth/register", {
			body: JSON.stringify({ email, name: name || undefined, password }),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});

		if (!res.ok) {
			const data = await res.json();
			toast.error(data.error || "Đăng ký thất bại");
			setLoading(false);
			return;
		}

		toast.success("Đăng ký thành công!");
		router.push("/sign-in");
		router.refresh();
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Đăng ký</CardTitle>
					<CardDescription>Tạo tài khoản mới</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">Tên</FieldLabel>
								<Input
									disabled={loading}
									id="name"
									onChange={(e) => setName(e.target.value)}
									placeholder="Nguyễn Văn A"
									type="text"
									value={name}
								/>
							</Field>

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
								<FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
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
								<FieldLabel htmlFor="confirmPassword">
									Xác nhận mật khẩu
								</FieldLabel>
								<div className="relative">
									<Input
										className="pr-10"
										disabled={loading}
										id="confirmPassword"
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										type={showConfirmPassword ? "text" : "password"}
										value={confirmPassword}
									/>
									<Button
										className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
										disabled={loading}
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										size="icon"
										tabIndex={-1}
										type="button"
										variant="ghost"
									>
										{showConfirmPassword ? (
											<EyeOff className="size-4" />
										) : (
											<Eye className="size-4" />
										)}
									</Button>
								</div>
							</Field>

							<Field>
								<Button disabled={loading} type="submit">
									{loading ? "Đang xử lý..." : "Đăng ký"}
								</Button>
								<FieldDescription
									className={cn(
										"text-center",
										loading && "pointer-events-none opacity-50",
									)}
								>
									Đã có tài khoản? <a href="/sign-in">Đăng nhập</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
