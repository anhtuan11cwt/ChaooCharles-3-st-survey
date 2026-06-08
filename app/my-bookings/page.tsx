import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";
import { getBookingsByUserId } from "@/actions/getBookingsByUserId";
import MyBookingClient from "@/components/booking/my-booking-client";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const bookingsIMade = await getBookingsByUserId();
  const bookingsFromVisitors = await getBookingsByHotelOwnerId();

  return (
    <section className="flex flex-col gap-10 py-8">
      <div>
        <h2 className="text-xl font-semibold mb-6 mt-2">
          Các đặt phòng bạn đã thực hiện
        </h2>
        {!bookingsIMade ? (
          <p className="text-muted-foreground">Không tìm thấy đặt phòng nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsIMade.map((booking) => (
              <MyBookingClient booking={booking} key={booking.id} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 mt-2">
          Các đặt phòng từ khách trên khách sạn của bạn
        </h2>
        {!bookingsFromVisitors ? (
          <p className="text-muted-foreground">Không tìm thấy đặt phòng nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsFromVisitors.map((booking) => (
              <MyBookingClient booking={booking} key={booking.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
