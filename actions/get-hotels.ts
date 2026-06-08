import { prisma } from "@/lib/prisma";

interface SearchParams {
  city?: string;
  state?: string;
  title?: string;
}

export const getHotels = async (searchParams: SearchParams = {}) => {
  try {
    const { title, state, city } = searchParams;

    const hotels = await prisma.hotel.findMany({
      include: { rooms: { include: { booking: true } } },
      where: {
        ...(title && { title: { contains: title } }),
        ...(state && { state }),
        ...(city && { city }),
      },
    });

    return hotels;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách sạn:", error);
    throw new Error("Không thể lấy danh sách khách sạn");
  }
};
