// File: src/app/api/order/[orderId]/pay/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PaymentMethod } from '@prisma/client';

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  
  try {
    const body = await request.json();
    const paymentMethod: PaymentMethod = body.paymentMethod; // CASH atau NONCASH

    if (!paymentMethod) {
      return NextResponse.json({ message: 'Metode pembayaran wajib diisi.' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod: paymentMethod,
        // Jika CASH, anggap sudah dibayar (atau akan segera dibayar)
        // Jika NONCASH, status tetap UNPAID (menunggu scan QR)
        paymentStatus: paymentMethod === 'CASH' ? 'PAID' : 'UNPAID',
      },
    });

    return NextResponse.json({ message: 'Metode pembayaran berhasil disimpan.', orderId: updatedOrder.id });
  } catch (error) {
    console.error('API Error (POST /api/order/[orderId]/pay):', error);
    return NextResponse.json(
      { message: 'Gagal memperbarui metode pembayaran.' },
      { status: 500 }
    );
  }
}