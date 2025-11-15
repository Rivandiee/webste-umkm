// File: src/app/api/order/[orderId]/summary/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
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
    
    // Format data untuk CheckoutPage
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