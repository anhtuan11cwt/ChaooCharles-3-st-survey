import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	description: "Ứng dụng khảo sát 3 giai đoạn",
	title: "Khảo sát 3 giai đoạn",
};

// Layout gốc, bao gồm Navbar và toast
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn("h-full antialiased", "font-sans", inter.variable)}
			lang="vi"
			suppressHydrationWarning
		>
			<body className="min-h-full">
				<Navbar />
				{children}
				<Toaster position="top-right" />
			</body>
		</html>
	);
}
