import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Gộp className với tailwind
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
