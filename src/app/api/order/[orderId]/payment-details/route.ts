// File: src/app/api/order/[orderId]/payment-details/route.ts
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
        id: true,
        paymentStatus: true,
        paymentMethod: true,
        totalPrice: true,
      }
    });
// ... (sisa file sama)
    if (!order) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }
    
    let qrCodeUrl = null;
    if (order.paymentMethod === 'NONCASH') {
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RMKita_Order_${orderId}_${order.totalPrice}`;
    }

    const paymentDetails = {
        orderId: order.id,
        paymentStatus: order.paymentStatus,
        qrCodeUrl: qrCodeUrl,
        totalAmount: order.totalPrice,
    };
    
    return NextResponse.json(paymentDetails);
  } catch (error) {
    console.error('API Error (GET /api/order/[orderId]/payment-details):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil detail pembayaran.' },
      { status: 500 }
    );
  }
}