import { Button } from "@/components/ui/button";

// Trang chủ mặc định
export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center gap-4 min-h-screen">
			<h1 className="text-3xl font-bold underline">Xin chào thế giới!</h1>
			<Button>Click me</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
		</div>
	);
}
