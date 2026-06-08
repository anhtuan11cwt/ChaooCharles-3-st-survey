import { getCurrentUser } from "@/lib/auth";
import { resolveLocationNames } from "@/lib/location-utils";
import { prisma } from "@/lib/prisma";

export const getHotelsByUserId = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Chưa đăng nhập");
    }

    const hotels = await prisma.hotel.findMany({
      include: { rooms: { include: { booking: true } } },
      where: { userId: user.id },
    });

    if (!hotels || hotels.length === 0) {
      return null;
    }

    const hotelsWithNames = await Promise.all(
      hotels.map(async (hotel) => {
        const { stateName, cityName } = await resolveLocationNames(
          hotel.state,
          hotel.city,
        );
        return { ...hotel, cityName, stateName };
      }),
    );

    return hotelsWithNames;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khách sạn của người dùng:", error);
    throw new Error("Không thể lấy danh sách khách sạn");
  }
};
