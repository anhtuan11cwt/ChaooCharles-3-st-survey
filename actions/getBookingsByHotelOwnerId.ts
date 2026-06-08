import { getCurrentUser } from "@/lib/auth";
import { resolveLocationNames } from "@/lib/location-utils";
import { prisma } from "@/lib/prisma";

export const getBookingsByHotelOwnerId = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Chưa đăng nhập");
    }

    const bookings = await prisma.booking.findMany({
      include: { hotel: true, room: true },
      orderBy: { bookedAt: "desc" },
      where: { hotelOwnerId: user.id },
    });

    if (!bookings || bookings.length === 0) {
      return null;
    }

    const bookingsWithNames = await Promise.all(
      bookings.map(async (booking) => {
        const { stateName, cityName } = await resolveLocationNames(
          booking.hotel.state,
          booking.hotel.city,
        );
        return { ...booking, hotel: { ...booking.hotel, cityName, stateName } };
      }),
    );

    return bookingsWithNames;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách đặt phòng trên khách sạn của người dùng:",
      error,
    );
    throw new Error("Không thể lấy danh sách đặt phòng");
  }
};
