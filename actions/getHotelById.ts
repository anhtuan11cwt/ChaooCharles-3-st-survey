import { prisma } from "@/lib/prisma";

export async function getHotelById(hotelId: string) {
	try {
		const hotel = await prisma.hotel.findUnique({
			include: { rooms: true },
			where: { id: hotelId },
		});

		if (!hotel) return null;

		return hotel;
	} catch (error) {
		console.error("Lỗi khi lấy khách sạn:", error);
		throw new Error("Không thể lấy khách sạn");
	}
}
