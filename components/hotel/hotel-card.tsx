"use client";

import { MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { HotelWithRooms } from "@/components/hotel/addHotelForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HotelCardProps {
  hotel: HotelWithRooms;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");

  const cardContent = (
    <>
      <div className="flex-1 aspect-square h-[220px] relative rounded-l-lg overflow-hidden">
        <Image
          alt={hotel.title}
          className="object-cover"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          src={hotel.image}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between h-[210px] p-4">
        <div>
          <h3 className="font-semibold text-lg">{hotel.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {hotel.description.substring(0, 45)}...
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-primary/80 text-sm">
            <MapPin className="h-4 w-4" />
            <span>
              {hotel.state}, {hotel.city}
            </span>
          </div>
          {hotel.rooms[0]?.roomPrice && (
            <p className="font-semibold text-sm">
              {hotel.rooms[0].roomPrice} / 24 giờ
            </p>
          )}
        </div>
        {isMyHotels && (
          <Button
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/hotel/${hotel.id}`);
            }}
            size="sm"
            variant="outline"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        )}
      </div>
    </>
  );

  if (isMyHotels) {
    return (
      <div className="flex gap-2 border border-primary/10 rounded-lg bg-primary/5">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      className={cn(
        "flex gap-2 border border-primary/10 rounded-lg bg-primary/5 transition hover:scale-105 cursor-pointer",
      )}
      href={`/hotel-details/${hotel.id}`}
    >
      {cardContent}
    </Link>
  );
}
