import type { HotelWithRooms } from "@/components/hotel/addHotelForm";
import HotelCard from "@/components/hotel/hotel-card";

interface HotelListProps {
  hotels: HotelWithRooms[];
}

export default function HotelList({ hotels }: HotelListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 mt-4">
      {hotels.map((hotel) => (
        <HotelCard hotel={hotel} key={hotel.id} />
      ))}
    </div>
  );
}
