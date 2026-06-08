"use client";

import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import {
  Bed,
  BedDouble,
  Building2,
  Check,
  CloudRain,
  Loader2,
  Mountain,
  Pencil,
  Trash2,
  TreePalm,
  Tv,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import toast from "react-hot-toast";
import AmenityItem from "@/components/amenity-item";
import type { HotelWithRooms } from "@/components/hotel/addHotelForm";
import AddRoomForm from "@/components/room/add-room-form";
import DateRangePicker from "@/components/room/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Booking, Room } from "@/lib/generated/prisma/client";

interface RoomCardProps {
  hotel: HotelWithRooms;
  room: Room & { booking: Booking[] };
}

export default function RoomCard({ hotel, room }: RoomCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [includeBreakfast, setIncludeBreakfast] = useState(false);

  const isHotelDetailsPage = pathname.includes("hotel-details");

  const disabledDates = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (room.booking) {
      for (const booking of room.booking) {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const bookedDays = eachDayOfInterval({ end, start });
        days.push(...bookedDays);
      }
    }
    if (date?.from) {
      const fromTime = date.from.getTime();
      const allDays = eachDayOfInterval({
        end: new Date(today.getTime() + 365 * 86400000),
        start: today,
      });
      for (const d of allDays) {
        if (d.getTime() < fromTime) {
          days.push(d);
        }
      }
    }
    return days;
  }, [room.booking, date]);

  const days = useMemo(() => {
    if (date?.from && date?.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      return dayCount > 0 ? dayCount : 1;
    }
    return 1;
  }, [date]);

  const totalPrice = useMemo(() => {
    if (date?.from && date?.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      if (dayCount > 0) {
        if (includeBreakfast && room.breakfastPrice > 0) {
          return dayCount * room.roomPrice + dayCount * room.breakfastPrice;
        }
        return dayCount * room.roomPrice;
      }
    }
    return room.roomPrice;
  }, [date, room.roomPrice, room.breakfastPrice, includeBreakfast]);

  const handleDialogOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleRoomDelete = useCallback(
    async (room: Room) => {
      setIsLoading(true);
      try {
        const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);
        await axios.post("/api/uploadthing/delete", { imageKey });
        await axios.delete(`/api/room/${room.id}`);
        toast.success("Đã xóa phòng");
        router.refresh();
      } catch {
        toast.error("Đã xảy ra lỗi");
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const handleBookRoom = useCallback(async () => {
    if (!date?.from || !date?.to) {
      toast.error("Vui lòng chọn ngày đặt phòng");
      return;
    }
    setBookingIsLoading(true);
    try {
      const bookingData = {
        breakfastIncluded: includeBreakfast,
        endDate: date.to,
        hotelId: hotel.id,
        hotelOwnerId: hotel.userId,
        roomId: room.id,
        startDate: date.from,
        totalPrice,
      };
      const res = await axios.post("/api/create-payment-intent", {
        booking: bookingData,
        paymentIntentId: null,
      });
      if (res.status === 200) {
        toast.success("Đã tạo đơn đặt phòng");
        router.push("/book-room");
      }
    } catch {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setBookingIsLoading(false);
    }
  }, [
    date,
    includeBreakfast,
    totalPrice,
    room.id,
    hotel.id,
    hotel.userId,
    router,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Image
          alt={room.title}
          className="h-auto w-full rounded-lg border border-border object-contain"
          height={0}
          sizes="100vw"
          src={room.image}
          width={0}
        />
        <div className="grid grid-cols-2 gap-4 text-sm content-start">
          <AmenityItem>
            <Bed className="h-4 w-4" />
            <span>{room.bedCount} giường</span>
          </AmenityItem>
          {room.kingBed > 0 && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              <span>{room.kingBed} King</span>
            </AmenityItem>
          )}
          {room.queenBed > 0 && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              <span>{room.queenBed} Queen</span>
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" />
              <span>Dịch vụ phòng</span>
            </AmenityItem>
          )}
          {room.tv && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              <span>TV</span>
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Building2 className="h-4 w-4" />
              <span>Ban công</span>
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              <span>Wi-Fi miễn phí</span>
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Building2 className="h-4 w-4" />
              <span>View thành phố</span>
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <CloudRain className="h-4 w-4" />
              <span>View đại dương</span>
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <Mountain className="h-4 w-4" />
              <span>View núi</span>
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <CloudRain className="h-4 w-4" />
              <span>Điều hòa</span>
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <TreePalm className="h-4 w-4" />
              <span>View rừng</span>
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              <span>Cách âm</span>
            </AmenityItem>
          )}
        </div>
        <Separator className="bg-primary/10" />
        <div className="flex gap-4 justify-between">
          <div>
            <p className="font-bold">Giá phòng</p>
            <p className="text-xs">{room.roomPrice} / 24 giờ</p>
          </div>
          {room.breakfastPrice > 0 && (
            <div>
              <p className="font-bold">Giá bữa sáng</p>
              <p className="text-xs">{room.breakfastPrice}</p>
            </div>
          )}
        </div>
      </CardContent>
      {isHotelDetailsPage ? (
        <CardFooter className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-semibold">
              Chọn ngày bạn muốn lưu trú tại phòng này
            </p>
            <DateRangePicker
              date={date}
              disabled={disabledDates}
              setDate={setDate}
            />
          </div>
          {room.breakfastPrice > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="breakfast"
                onCheckedChange={(value) => setIncludeBreakfast(!!value)}
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="breakfast"
              >
                Bạn có muốn dùng bữa sáng mỗi ngày không?
              </label>
            </div>
          )}
          <div className="flex gap-4 w-full">
            <p className="font-bold">
              Tổng: <span className="font-bold">{totalPrice}</span>
            </p>
            <p className="font-bold">
              Số ngày: <span className="font-bold">{days}</span>
            </p>
          </div>
          <Button
            disabled={bookingIsLoading}
            onClick={handleBookRoom}
            type="button"
          >
            {bookingIsLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {bookingIsLoading ? "Đang xử lý..." : "Đặt phòng"}
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="gap-4">
          <Button disabled={isLoading} onClick={handleDialogOpen} type="button">
            <Pencil className="mr-2 h-4 w-4" />
            Cập nhật
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => handleRoomDelete(room)}
            type="button"
            variant="destructive"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Xóa
          </Button>
        </CardFooter>
      )}
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="max-h-[85vh] w-[90%] overflow-y-auto scrollbar-hide sm:max-w-[900px] px-2">
          <DialogHeader className="px-4">
            <DialogTitle>Cập nhật phòng</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin phòng</DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4">
            <AddRoomForm
              handleDialogOpen={handleDialogOpen}
              hotel={hotel}
              room={room}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
