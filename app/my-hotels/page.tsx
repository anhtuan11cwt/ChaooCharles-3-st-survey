import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/hotel-list";

export const dynamic = "force-dynamic";

export default async function MyHotelsPage() {
  const hotels = await getHotelsByUserId();

  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-6">Khách sạn của tôi</h2>
      {!hotels ? (
        <p className="text-muted-foreground">Không tìm thấy khách sạn nào</p>
      ) : (
        <HotelList hotels={hotels} />
      )}
    </section>
  );
}
