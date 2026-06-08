import { getHotels } from "@/actions/get-hotels";
import HotelList from "@/components/hotel/hotel-list";

interface HomeProps {
  searchParams: Promise<{
    title?: string;
    state?: string;
    city?: string;
  }>;
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams;
  const hotels = await getHotels(searchParams);

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground text-lg">
          Không tìm thấy khách sạn nào
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-4">Khách sạn</h1>
      <HotelList hotels={hotels} />
    </div>
  );
}
