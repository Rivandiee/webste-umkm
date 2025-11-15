// File: src/app/api/tables/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

// GET: Daftar semua meja
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      select: { id: true, number: true },
      orderBy: { number: 'asc' },
    });
    return NextResponse.json(tables);
  } catch (error) {
    console.error('API Error (GET /api/tables):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil daftar meja.' },
      { status: 500 }
    );
  }
}