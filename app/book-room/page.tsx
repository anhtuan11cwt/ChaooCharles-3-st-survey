"use client";

import useBookRoom from "@/hooks/useBookRoom";

export default function BookRoomPage() {
  const { bookingRoomData } = useBookRoom();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Thanh toán đặt phòng</h1>
      {bookingRoomData ? (
        <div className="space-y-4">
          <p>Phòng: {bookingRoomData.room.title}</p>
          <p>Tổng: {bookingRoomData.totalPrice}</p>
        </div>
      ) : (
        <p>Không có thông tin đặt phòng</p>
      )}
    </div>
  );
}
