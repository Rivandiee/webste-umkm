// File: src/app/api/order/[orderId]/summary/route.ts
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
        totalPrice: true,
        items: {
          include: {
            menu: {
              select: { name: true, price: true }
            }
          }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json({ message: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }
    
    const summary = {
        id: order.id,
        totalPrice: order.totalPrice,
        items: order.items.map(item => ({
            name: item.menu.name,
            price: item.price, 
            qty: item.qty,
        }))
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('API Error (GET /api/order/[orderId]/summary):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil ringkasan pesanan.' },
      { status: 500 }
    );
  }
}