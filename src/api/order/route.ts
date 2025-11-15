// File: src/app/api/order/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

// POST: Buat Pesanan Baru (dari halaman Cart)
export async function POST(request: Request) {
  try {
    const { tableId, items, totalPrice } = await request.json();
    
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table) {
        return NextResponse.json({ message: 'Nomor meja tidak valid.' }, { status: 400 });
    }

    if (!items || items.length === 0 || !totalPrice) {
      return NextResponse.json(
        { message: 'Data pesanan tidak lengkap.' },
        { status: 400 }
      );
    }
    
    const newOrder = await prisma.order.create({
      data: {
        tableId: tableId,
        totalPrice: Number(totalPrice),
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        
        items: {
          create: items.map((item: any) => ({
            menuId: item.menuId,
            qty: item.qty,
            note: item.note || null,
            price: item.price,
          })),
        },
      },
      select: {
        id: true 
      }
    });

    return NextResponse.json({ orderId: newOrder.id, message: 'Pesanan berhasil dibuat.' }, { status: 201 });
  } catch (error) {
    console.error('API Error (POST /api/order):', error);
    return NextResponse.json(
      { message: 'Gagal membuat pesanan.' },
      { status: 500 }
    );
  }
}