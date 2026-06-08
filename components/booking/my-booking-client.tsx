"use client";

import { differenceInCalendarDays } from "date-fns";
import { Loader2, MapPin } from "lucide-react";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Booking, Hotel, Room } from "@/lib/generated/prisma/client";
import { formatPrice } from "@/lib/utils";

interface MyBookingClientProps {
  booking: Booking & {
    room: Room | null;
    hotel: Hotel & { cityName?: string; stateName?: string };
  };
}

export default function MyBookingClient({ booking }: MyBookingClientProps) {
  const router = useRouter();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { hotel, room } = booking;

  if (!hotel || !room) {
    return null;
  }

  const startDate = moment(booking.startDate);
  const endDate = moment(booking.endDate);
  const dayCount = differenceInCalendarDays(
    new Date(booking.endDate),
    new Date(booking.startDate),
  );

  const handleBookRoom = async () => {
    setPaymentLoading(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        body: JSON.stringify({
          booking: {
            breakfastIncluded: booking.breakfastIncluded,
            endDate: booking.endDate,
            hotelId: booking.hotelId,
            hotelOwnerId: booking.hotelOwnerId,
            roomId: booking.roomId,
            startDate: booking.startDate,
            totalPrice: booking.totalPrice,
          },
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.url) {
        toast.success("Đang chuyển đến trang thanh toán...");
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Đã xảy ra lỗi");
      }
    } catch {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hotel.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 text-primary/80">
            <MapPin className="h-4 w-4" />
            <span className="flex flex-col text-sm">
              <span>{hotel.cityName}</span>
              <span>{hotel.stateName}</span>
            </span>
          </div>
        </CardDescription>
        <CardDescription className="pt-2">
          {hotel.locationDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold mb-1">Chi tiết đặt phòng</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Đặt bởi: {booking.userName}</p>
            <p>Thời gian đặt: {moment(booking.bookedAt).fromNow()}</p>
            <p>Nhận phòng: {startDate.format("DD/MM/yyyy")}</p>
            <p>Trả phòng: {endDate.format("DD/MM/yyyy")} lúc 5:00 PM</p>
            <p>Lưu trú: {dayCount} ngày</p>
            <p>Bữa sáng: {booking.breakfastIncluded ? "Có" : "Không"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Tổng:</span>
          <span className="text-sm font-bold">
            {formatPrice(booking.totalPrice)}
          </span>
        </div>
        <div>
          <span className="text-sm font-semibold">Phòng: </span>
          <span className="text-sm">{room.title}</span>
        </div>
        <div>
          {booking.paymentStatus === "true" ? (
            <span className="text-sm font-semibold text-green-500">
              Đã thanh toán
            </span>
          ) : (
            <span className="text-sm font-semibold text-rose-500">
              Chưa thanh toán
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          onClick={() => router.push(`/hotel-details/${hotel.id}`)}
          variant="outline"
        >
          Xem khách sạn
        </Button>
        {booking.paymentStatus !== "true" && (
          <Button disabled={paymentLoading} onClick={handleBookRoom}>
            {paymentLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {paymentLoading ? "Đang xử lý..." : "Thanh toán ngay"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
