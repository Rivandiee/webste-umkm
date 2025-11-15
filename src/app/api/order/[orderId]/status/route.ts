// File: src/app/api/order/[orderId]/status/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const orderId = Number(params.orderId); // <-- DIUBAH ke Number
  if (isNaN(orderId)) { // <-- DITAMBAH validasi
      return NextResponse.json({ message: 'ID Pesanan tidak valid.' }, { status: 400 });
  }
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }, // <-- DIUBAH ke number
      select: {
// ... (sisa file sama)
        id: true,
        status: true,
        paymentStatus: true,
      }
    });

    if (!order) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    const statusDetail = {
        orderId: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
    };
    
    return NextResponse.json(statusDetail);
  } catch (error) {
    console.error('API Error (GET /api/order/[orderId]/status):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil status pesanan.' },
      { status: 500 }
    );
  }
}