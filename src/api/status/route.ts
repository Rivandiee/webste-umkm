import { PrismaClient, OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const { orderId, status, paymentStatus } = await req.json();

    const update = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as OrderStatus,
        paymentStatus: paymentStatus as PaymentStatus,
      },
    });

    return NextResponse.json(update);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
