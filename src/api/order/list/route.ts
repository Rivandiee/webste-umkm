// File: src/app/api/order/list/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        table: true, 
      },
    });

    const formattedOrders = orders.map(order => ({
        id: order.id,
        name: `Meja ${order.table.number}`, 
        total: order.totalPrice,
        status: order.status,
        time: order.createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }));
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('API Error (GET /api/order/list):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil daftar pesanan.' },
      { status: 500 }
    );
  }
}