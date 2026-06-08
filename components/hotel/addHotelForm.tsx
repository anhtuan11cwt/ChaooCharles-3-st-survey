"use client";

import type { Hotel, Room } from "@/lib/generated/prisma/client";

export type HotelWithRooms = Hotel & { rooms: Room[] };

interface AddHotelFormProps {
	hotel: HotelWithRooms | null;
}

export default function AddHotelForm({ hotel }: AddHotelFormProps) {
	return (
		<div>
			<h2>{hotel ? "Cập nhật khách sạn" : "Tạo khách sạn mới"}</h2>
		</div>
	);
}
