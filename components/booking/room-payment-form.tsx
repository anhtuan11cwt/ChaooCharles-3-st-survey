"use client";

import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import type { BookRoomStore } from "@/hooks/useBookRoom";
import { formatPrice } from "@/lib/utils";

interface RoomPaymentFormProps {
  bookingRoomData: NonNullable<BookRoomStore["bookingRoomData"]>;
  handleSetPaymentSuccess: (value: boolean) => void;
  resetBookRoom: () => void;
}

export default function RoomPaymentForm({
  handleSetPaymentSuccess,
  bookingRoomData,
  resetBookRoom,
}: RoomPaymentFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements || !bookingRoomData) {
      setIsLoading(false);
      return;
    }
    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      if (result.error) {
        toast.error(result.error.message ?? "Lỗi thanh toán");
      } else {
        await axios.patch(`/api/booking/${result.paymentIntent.id}`);
        toast.success("Thanh toán thành công");
        router.refresh();
        resetBookRoom();
        handleSetPaymentSuccess(true);
      }
    } catch {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="mt-8 mb-4 space-y-6"
      id="payment-form"
      onSubmit={handleSubmit}
    >
      <AddressElement options={{ mode: "billing" }} />
      <PaymentElement options={{ layout: "tabs" }} />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Ngày nhận phòng:</span>
          <span className="font-semibold">
            {moment(bookingRoomData.startDate).format("DD/MM/yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Ngày trả phòng:</span>
          <span className="font-semibold">
            {moment(bookingRoomData.endDate).format("DD/MM/yyyy")}
          </span>
        </div>
        {bookingRoomData.breakfast && (
          <div className="flex justify-between">
            <span>Bữa sáng:</span>
            <span className="font-semibold">Có</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2">
          <span className="font-bold">Tổng:</span>
          <span className="font-bold">
            {formatPrice(bookingRoomData.totalPrice)}
          </span>
        </div>
      </div>
      {isLoading && (
        <div className="text-sm text-muted-foreground text-center">
          Đang xử lý thanh toán - vui lòng không rời trang...
        </div>
      )}
      <Button
        className="w-full"
        disabled={isLoading || !stripe || !elements}
        type="submit"
      >
        {isLoading ? "Đang xử lý..." : "Thanh toán ngay"}
      </Button>
    </form>
  );
}
