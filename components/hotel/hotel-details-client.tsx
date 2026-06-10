"use client";

import { Bike, Coffee, Film, MapPin, ShoppingBag, Wifi } from "lucide-react";
import Image from "next/image";
import {
  FaDumbbell,
  FaGlassMartiniAlt,
  FaSpa,
  FaSwimmer,
} from "react-icons/fa";
import { MdDryCleaning, MdLocalParking, MdRestaurant } from "react-icons/md";
import type { HotelWithRooms } from "@/components/hotel/addHotelForm";
import RoomCard from "@/components/room/room-card";
import type { Booking } from "@/lib/generated/prisma/client";

interface HotelDetailsClientProps {
  bookings: Booking[];
  currentUserId?: string;
  hotel: HotelWithRooms;
}

// Danh sách tiện ích với icon và tên hiển thị
const amenitiesList = [
  { available: false, icon: FaDumbbell, label: "Phòng tập gym" },
  { available: false, icon: FaSpa, label: "Spa" },
  { available: false, icon: FaGlassMartiniAlt, label: "Quầy bar" },
  { available: false, icon: MdDryCleaning, label: "Giặt ủi" },
  { available: false, icon: MdRestaurant, label: "Nhà hàng" },
  { available: false, icon: ShoppingBag, label: "Mua sắm" },
  { available: false, icon: MdLocalParking, label: "Đỗ xe miễn phí" },
  { available: false, icon: Bike, label: "Thuê xe đạp" },
  { available: false, icon: Wifi, label: "Wifi miễn phí" },
  { available: false, icon: Film, label: "Đêm phim" },
  { available: false, icon: FaSwimmer, label: "Hồ bơi" },
  { available: false, icon: Coffee, label: "Quán cà phê" },
] as const;

// Trang chi tiết khách sạn — hiển thị ảnh, thông tin, tiện ích và danh sách phòng
export default function HotelDetailsClient({
  hotel,
  bookings,
  currentUserId,
}: HotelDetailsClientProps) {
  const getAmenities = () => {
    return amenitiesList.map((amenity) => ({
      ...amenity,
      available: hotel[
        amenity.label === "Phòng tập gym"
          ? "gym"
          : amenity.label === "Spa"
            ? "spa"
            : amenity.label === "Quầy bar"
              ? "bar"
              : amenity.label === "Giặt ủi"
                ? "laundry"
                : amenity.label === "Nhà hàng"
                  ? "restaurant"
                  : amenity.label === "Mua sắm"
                    ? "shopping"
                    : amenity.label === "Đỗ xe miễn phí"
                      ? "freeParking"
                      : amenity.label === "Thuê xe đạp"
                        ? "bikeRental"
                        : amenity.label === "Wifi miễn phí"
                          ? "freeWifi"
                          : amenity.label === "Đêm phim"
                            ? "movieNight"
                            : amenity.label === "Hồ bơi"
                              ? "swimmingPool"
                              : "coffeeShop"
      ] as boolean,
    }));
  };

  const amenities = getAmenities();

  return (
    <div className="py-8 space-y-8">
      <div className="w-full rounded-lg overflow-hidden">
        <Image
          alt={hotel.title}
          className="w-full h-auto object-contain"
          height={0}
          sizes="100vw"
          src={hotel.image}
          style={{ height: "auto", width: "100%" }}
          width={0}
        />
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{hotel.title}</h1>
        <div className="flex items-center gap-1 mt-2 text-primary/80">
          <MapPin className="h-4 w-4" />
          <span className="flex flex-col text-sm">
            <span>{hotel.cityName}</span>
            <span>{hotel.stateName}</span>
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Mô tả vị trí</h2>
        <p className="text-muted-foreground">{hotel.locationDescription}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Giới thiệu khách sạn</h2>
        <p className="text-muted-foreground">{hotel.description}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Tiện ích nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenities
            .filter((a) => a.available)
            .map((amenity) => (
              <div
                className="flex items-center gap-2 text-sm"
                key={amenity.label}
              >
                <amenity.icon className="h-5 w-5 text-primary" />
                <span>{amenity.label}</span>
              </div>
            ))}
        </div>
      </div>

      {hotel.rooms.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Phòng khách sạn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <RoomCard
                bookings={bookings}
                currentUserId={currentUserId}
                hotel={hotel}
                key={room.id}
                room={room}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
