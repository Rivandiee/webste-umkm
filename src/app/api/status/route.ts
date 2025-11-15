// File: src/app/api/status/route.ts
import { PrismaClient, OrderStatus, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const { orderId, status, paymentStatus } = await req.json();

    const numericOrderId = Number(orderId); // <-- DITAMBAH konversi
    if (isNaN(numericOrderId)) { // <-- DITAMBAH validasi
        return NextResponse.json({ error: "Order ID tidak valid" }, { status: 400 });
    }

    const update = await prisma.order.update({
      where: { id: numericOrderId }, // <-- DIUBAH ke number
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