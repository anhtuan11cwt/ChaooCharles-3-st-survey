import { prisma } from "@/lib/prisma";

export const getBookings = async (hotelId: string) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await prisma.booking.findMany({
      where: {
        endDate: { gt: yesterday },
        hotelId,
      },
    });

    return bookings;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    throw new Error("Không thể lấy danh sách đặt phòng");
  }
};
