// File: src/app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalMenu = await prisma.menu.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    const newOrders = await prisma.order.count({
      where: {
        status: 'PENDING',
      },
    });

    const stats = {
      totalMenu,
      dailyOrders,
      newOrders,
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error (GET /api/dashboard/stats):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil statistik dashboard.' },
      { status: 500 }
    );
  }
}