import { getBookings } from "@/actions/get-bookings";
import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/hotel/hotel-details-client";

interface HotelDetailsProps {
  params: Promise<{ hotelId: string }>;
}

export default async function HotelDetails(props: HotelDetailsProps) {
  const { hotelId } = await props.params;
  const hotel = await getHotelById(hotelId);
  const bookings = await getBookings(hotelId);

  if (!hotel) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground text-lg">
          Không tìm thấy khách sạn với ID này
        </p>
      </div>
    );
  }

  return <HotelDetailsClient bookings={bookings} hotel={hotel} />;
}
