import { getHotelById } from "@/actions/getHotelById";
import type { HotelWithRooms } from "@/components/hotel/addHotelForm";
import AddHotelForm from "@/components/hotel/addHotelForm";
import { requireAuth } from "@/lib/auth";

interface HotelPageProps {
	params: Promise<{ hotelId: string }>;
}

export default async function HotelPage({ params }: HotelPageProps) {
	const { hotelId } = await params;

	const user = await requireAuth();

	let hotel: HotelWithRooms | null = null;

	if (hotelId !== "new") {
		const existingHotel = await getHotelById(hotelId);

		if (!existingHotel) {
			return <div>Không tìm thấy khách sạn</div>;
		}

		if (existingHotel.userId !== user.id) {
			return <div>Truy cập bị từ chối</div>;
		}

		hotel = existingHotel as HotelWithRooms;
	}

	return (
		<section className="mx-auto flex min-h-[80vh] max-w-7xl flex-col px-4 py-8">
			<AddHotelForm hotel={hotel} />
		</section>
	);
}
