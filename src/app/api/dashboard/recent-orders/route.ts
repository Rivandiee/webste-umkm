// File: src/app/api/dashboard/recent-orders/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET() {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { status: { not: 'DONE' } }, 
      include: {
        table: true, 
        items: {
            take: 1, 
            include: {
                menu: {
                    select: { name: true }
                }
            }
        }
      },
    });

    const formattedOrders = recentOrders.map(order => ({
        id: order.id,
        name: `Meja ${order.table.number}`, 
        item: order.items[0]?.menu.name || 'Banyak Item',
        status: order.status.toLowerCase(),
    }));
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('API Error (GET /api/dashboard/recent-orders):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil pesanan terbaru.' },
      { status: 500 }
    );
  }
}