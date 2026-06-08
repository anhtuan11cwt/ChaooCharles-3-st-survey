"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

import axios from "axios";
import {
  Eye,
  Flame,
  ImageIcon,
  Loader2,
  PencilLine,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import AddRoomForm from "@/components/room/add-room-form";
import RoomCard from "@/components/room/room-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useLocation, { type District, type Province } from "@/hooks/useLocation";
import type { Booking, Hotel, Room } from "@/lib/generated/prisma/client";

export type HotelWithRooms = Hotel & {
  rooms: (Room & { booking: Booking[] })[];
};

interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

const formSchema = z
  .object({
    bar: z.boolean(),
    bikeRental: z.boolean(),
    city: z.string().min(1, { message: "Vui lòng chọn quận/huyện" }),
    coffeeShop: z.boolean(),
    description: z
      .string()
      .min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),
    freeParking: z.boolean(),
    freeWifi: z.boolean(),
    gym: z.boolean(),
    image: z.string().min(1, { message: "Vui lòng chọn ảnh khách sạn" }),
    laundry: z.boolean(),
    locationDescription: z
      .string()
      .min(10, { message: "Mô tả vị trí phải có ít nhất 10 ký tự" }),
    movieNight: z.boolean(),
    restaurant: z.boolean(),
    shopping: z.boolean(),
    spa: z.boolean(),
    state: z.string().min(1, { message: "Vui lòng chọn tỉnh/thành phố" }),
    swimmingPool: z.boolean(),
    title: z.string().min(3, { message: "Tiêu đề phải có ít nhất 3 ký tự" }),
  })
  .refine(
    (data) =>
      data.bar ||
      data.bikeRental ||
      data.coffeeShop ||
      data.freeParking ||
      data.freeWifi ||
      data.gym ||
      data.laundry ||
      data.movieNight ||
      data.restaurant ||
      data.shopping ||
      data.spa ||
      data.swimmingPool,
    {
      message: "Vui lòng chọn ít nhất một tiện ích",
      path: ["amenities"],
    },
  );

type HotelFormValues = z.infer<typeof formSchema>;

const defaultValues: HotelFormValues = {
  bar: false,
  bikeRental: false,
  city: "",
  coffeeShop: false,
  description: "",
  freeParking: false,
  freeWifi: false,
  gym: false,
  image: "",
  laundry: false,
  locationDescription: "",
  movieNight: false,
  restaurant: false,
  shopping: false,
  spa: false,
  state: "",
  swimmingPool: false,
  title: "",
};

const amenities = [
  { label: "Phòng tập gym", name: "gym" },
  { label: "Spa", name: "spa" },
  { label: "Quầy bar", name: "bar" },
  { label: "Giặt ủi", name: "laundry" },
  { label: "Nhà hàng", name: "restaurant" },
  { label: "Mua sắm", name: "shopping" },
  { label: "Đỗ xe miễn phí", name: "freeParking" },
  { label: "Thuê xe đạp", name: "bikeRental" },
  { label: "Wifi miễn phí", name: "freeWifi" },
  { label: "Đêm phim", name: "movieNight" },
  { label: "Hồ bơi", name: "swimmingPool" },
  { label: "Quán cà phê", name: "coffeeShop" },
] as const;

export default function AddHotelForm({ hotel }: AddHotelFormProps) {
  const router = useRouter();
  const selectedFileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(hotel?.image ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const { fetchAllProvinces, fetchDistrictsByProvinceId } = useLocation();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const handleDialogOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (error) => {
      toast.error(`Lỗi tải ảnh: ${error.message}`);
    },
  });

  const form = useForm<HotelFormValues>({
    defaultValues: hotel
      ? {
          bar: hotel.bar,
          bikeRental: hotel.bikeRental,
          city: hotel.city,
          coffeeShop: hotel.coffeeShop,
          description: hotel.description,
          freeParking: hotel.freeParking,
          freeWifi: hotel.freeWifi,
          gym: hotel.gym,
          image: hotel.image,
          laundry: hotel.laundry,
          locationDescription: hotel.locationDescription,
          movieNight: hotel.movieNight,
          restaurant: hotel.restaurant,
          shopping: hotel.shopping,
          spa: hotel.spa,
          state: hotel.state,
          swimmingPool: hotel.swimmingPool,
          title: hotel.title,
        }
      : defaultValues,
    resolver: zodResolver(formSchema),
  });

  const selectedProvince = useWatch({ control: form.control, name: "state" });
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetchAllProvinces().then(setProvinces);
  }, [fetchAllProvinces]);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistrictsByProvinceId(selectedProvince).then((data) => {
        startTransition(() => setDistricts(data));
      });
    } else {
      startTransition(() => setDistricts([]));
    }
  }, [selectedProvince, fetchDistrictsByProvinceId]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      selectedFileRef.current = file;
      setPreviewUrl(URL.createObjectURL(file));
      form.setValue("image", "pending-upload", { shouldValidate: false });
    },
    [previewUrl, form],
  );

  const handleRemoveImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    selectedFileRef.current = null;
    setPreviewUrl("");
    form.setValue("image", "", { shouldTouch: true, shouldValidate: true });
  }, [previewUrl, form]);

  const onSubmit = useCallback(
    async (values: HotelFormValues) => {
      setIsLoading(true);
      try {
        let imageUrl = values.image ?? "";

        if (selectedFileRef.current) {
          if (hotel?.image) {
            const oldImageKey = hotel.image.substring(
              hotel.image.lastIndexOf("/") + 1,
            );
            try {
              await axios.post("/api/uploadthing/delete", {
                imageKey: oldImageKey,
              });
            } catch {
              // Ignore failure to delete old image
            }
          }

          const uploadResult = await startUpload([selectedFileRef.current]);
          imageUrl = uploadResult?.[0]?.ufsUrl ?? "";
          if (!imageUrl) {
            toast.error("Tải ảnh lên thất bại - không nhận được URL");
            setIsLoading(false);
            return;
          }
        } else {
          imageUrl = values.image ?? "";
          if (imageUrl === "pending-upload") imageUrl = "";
        }

        if (!imageUrl) {
          toast.error("Vui lòng chọn ảnh khách sạn");
          setIsLoading(false);
          return;
        }

        const submitData = { ...values, image: imageUrl };

        if (hotel) {
          await axios.patch(`/api/hotel/${hotel.id}`, submitData);
          toast.success("Đã cập nhật khách sạn");
          router.push(`/hotel/${hotel.id}`);
        } else {
          const res = await axios.post("/api/hotel", submitData);
          toast.success("Đã tạo khách sạn");
          router.push(`/hotel/${res.data.id}`);
        }
      } catch {
        toast.error("Đã xảy ra lỗi");
      } finally {
        setIsLoading(false);
      }
    },
    [startUpload, hotel, router],
  );

  async function handleDeleteHotel() {
    if (!hotel) return;
    setIsDeleting(true);
    try {
      const imageKey = hotel.image.substring(hotel.image.lastIndexOf("/") + 1);
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/hotel/${hotel.id}`);
      toast.success("Đã xóa khách sạn");
      router.push("/hotel/new");
    } catch {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    },
    [form, onSubmit],
  );

  return (
    <Form className="space-y-7" form={form} onSubmit={handleFormSubmit}>
      <h3 className="text-lg font-semibold">
        {hotel ? "Cập nhật khách sạn" : "Mô tả khách sạn"}
      </h3>
      {hotel && hotel.rooms.length === 0 && (
        <Alert className="bg-indigo-600 text-white">
          <Flame className="!text-white" />
          <AlertTitle className="text-white">Bước cuối cùng 🔥</AlertTitle>
          <AlertDescription className="text-white">
            Khách sạn của bạn đã được tạo thành công!
            <br />
            Vui lòng thêm phòng để hoàn tất thiết lập khách sạn.
          </AlertDescription>
        </Alert>
      )}
      {hotel && (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button
              className="max-w-[150px]"
              onClick={(e) => {
                e.stopPropagation();
              }}
              type="button"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm phòng
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] w-[90%] overflow-y-auto scrollbar-hide sm:max-w-[900px] px-2">
            <DialogHeader className="px-4">
              <DialogTitle>Thêm phòng mới</DialogTitle>
              <DialogDescription>
                Thêm thông tin chi tiết về phòng trong khách sạn
              </DialogDescription>
            </DialogHeader>
            <div className="px-4 pb-4">
              <AddRoomForm handleDialogOpen={handleDialogOpen} hotel={hotel} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div
        className={`mt-6 flex flex-col gap-6 md:flex-row transition-opacity duration-300 ${isLoading || isDeleting ? "pointer-events-none opacity-80" : ""}`}
      >
        <div className="flex flex-1 flex-col gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tiêu đề khách sạn <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription>Nhập tên khách sạn của bạn</FormDescription>
                <FormControl>
                  <Input
                    disabled={isLoading || isDeleting}
                    placeholder="Khách sạn Biển"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mô tả khách sạn <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription>
                  Cung cấp mô tả chi tiết về khách sạn của bạn
                </FormDescription>
                <FormControl>
                  <Textarea
                    disabled={isLoading || isDeleting}
                    placeholder="Mô tả khách sạn..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>
                  Hình ảnh khách sạn <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription>
                  Chọn ảnh JPG hoặc PNG, tối đa 8MB
                </FormDescription>
                <FormControl>
                  {previewUrl ? (
                    <div className="relative">
                      <Image
                        alt="Xem trước"
                        className="h-auto w-full rounded-lg border border-border object-contain"
                        height={0}
                        sizes="100vw"
                        src={previewUrl}
                        width={0}
                      />
                      <Button
                        className="absolute -right-2 -top-2 h-7 w-7 rounded-full"
                        disabled={isLoading || isDeleting}
                        onClick={handleRemoveImage}
                        size="icon"
                        type="button"
                        variant="destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50"
                      htmlFor="hotel-image-upload"
                    >
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Nhấn để chọn ảnh
                      </span>
                      <Input
                        accept="image/*"
                        className="hidden"
                        disabled={isLoading || isDeleting}
                        id="hotel-image-upload"
                        onChange={handleFileChange}
                        type="file"
                      />
                    </label>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tỉnh/Thành phố <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={provinces.length < 1 || isLoading || isDeleting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem
                            key={province.idProvince}
                            value={province.idProvince}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quận/Huyện <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={districts.length < 1 || isLoading || isDeleting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem
                            key={district.idDistrict}
                            value={district.idDistrict}
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="locationDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mô tả vị trí <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription>Mô tả vị trí của khách sạn</FormDescription>
                <FormControl>
                  <Textarea
                    disabled={isLoading || isDeleting}
                    placeholder="Mô tả vị trí..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <div>
            <FormLabel>
              Chọn tiện ích <span className="text-destructive">*</span>
            </FormLabel>
            <FormDescription>
              Chọn các tiện ích có sẵn tại khách sạn
            </FormDescription>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {amenities.map((amenity) => (
                <FormField
                  control={form.control}
                  key={amenity.name}
                  name={amenity.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          className="mt-0.5"
                          disabled={isLoading || isDeleting}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {amenity.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {(form.formState.errors as Record<string, { message?: string }>)
              .amenities && (
              <p className="text-[0.8rem] font-medium text-destructive mt-2">
                {
                  (
                    form.formState.errors as Record<
                      string,
                      { message?: string }
                    >
                  ).amenities?.message
                }
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2">
        {hotel ? (
          <Button
            className="max-w-[150px]"
            disabled={isLoading || isDeleting}
            type="submit"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PencilLine className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        ) : (
          <Button className="max-w-[150px]" disabled={isLoading} type="submit">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PencilLine className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Đang tạo..." : "Tạo khách sạn"}
          </Button>
        )}
        {hotel && (
          <>
            <Button
              className="max-w-[150px]"
              disabled={isDeleting || isLoading}
              onClick={handleDeleteHotel}
              type="button"
              variant="destructive"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
            <Button
              onClick={() => router.push(`/hotel/details/${hotel.id}`)}
              type="button"
              variant="outline"
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem
            </Button>
          </>
        )}
      </div>
      {hotel && hotel.rooms.length > 0 && (
        <>
          <Separator className="bg-primary/10" />
          <h3 className="text-lg font-semibold my-4">
            Phòng khách sạn ({hotel.rooms.length})
          </h3>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
            {hotel.rooms.map((room) => (
              <RoomCard
                bookings={room.booking}
                hotel={hotel}
                key={room.id}
                room={room}
              />
            ))}
          </div>
        </>
      )}
    </Form>
  );
}
