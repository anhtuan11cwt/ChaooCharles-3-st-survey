import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { booking, paymentIntentId } = body;

    const bookingData = {
      ...booking,
      currency: "vnd",
      paymentIntentId: paymentIntentId ?? null,
      paymentStatus: "false",
      userEmail: user.email,
      userId: user.id,
      username: user.name ?? user.email,
    };

    if (paymentIntentId) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          paymentIntentId,
          userId: user.id,
        },
      });
      if (existingBooking) {
        const updatedIntent = await stripe.paymentIntents.update(
          paymentIntentId,
          { amount: bookingData.totalPrice },
        );
        await prisma.booking.update({
          data: {
            breakfastIncluded: bookingData.breakfastIncluded,
            endDate: new Date(bookingData.endDate),
            startDate: new Date(bookingData.startDate),
            totalPrice: bookingData.totalPrice,
          },
          where: { id: existingBooking.id },
        });
        return NextResponse.json({ paymentIntent: updatedIntent });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: bookingData.totalPrice,
      automatic_payment_methods: { enabled: true },
      currency: bookingData.currency,
    });

    bookingData.paymentIntentId = paymentIntent.id;

    await prisma.booking.create({
      data: {
        breakfastIncluded: bookingData.breakfastIncluded,
        currency: bookingData.currency,
        endDate: new Date(bookingData.endDate),
        hotelId: bookingData.hotelId,
        hotelOwnerId: bookingData.hotelOwnerId,
        paymentIntentId: bookingData.paymentIntentId,
        paymentStatus: bookingData.paymentStatus,
        roomId: bookingData.roomId,
        startDate: new Date(bookingData.startDate),
        totalPrice: bookingData.totalPrice,
        userEmail: bookingData.userEmail,
        userId: bookingData.userId,
        userName: bookingData.username,
      },
    });

    return NextResponse.json({ paymentIntent });
  } catch (error) {
    console.error("Lỗi tạo payment intent:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
