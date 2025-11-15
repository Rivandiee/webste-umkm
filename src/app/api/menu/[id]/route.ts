// File: src/app/api/menu/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

interface Context {
  params: { id: string };
}

// 1. GET: Ambil detail menu by ID (Protected)
export async function GET(request: Request, context: Context) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }
    
    try {
        const id = parseInt(context.params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'ID Menu tidak valid.' }, { status: 400 });
        }
        
        const menu = await prisma.menu.findUnique({
            where: { id: id },
        });

        if (!menu) {
            return NextResponse.json({ message: 'Menu tidak ditemukan.' }, { status: 404 });
        }
        return NextResponse.json(menu);
    } catch (error) {
        console.error('API Error (GET /api/menu/[id]):', error);
        return NextResponse.json(
            { message: 'Gagal mengambil detail menu.' },
            { status: 500 }
        );
    }
}

// 2. PATCH: Update menu by ID (Protected)
export async function PATCH(request: Request, context: Context) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }

    try {
        const id = parseInt(context.params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'ID Menu tidak valid.' }, { status: 400 });
        }

        const body = await request.json();
        const { name, price, categoryId, image } = body;

        if (!name || !price || !categoryId) {
            return NextResponse.json(
                { message: 'Nama, harga, dan kategori wajib diisi.' },
                { status: 400 }
            );
        }
        
        const numericPrice = Number(price);
        const numericCategoryId = Number(categoryId);

        if (isNaN(numericPrice) || isNaN(numericCategoryId)) {
             return NextResponse.json(
                { message: 'Harga atau Kategori ID tidak valid.' },
                { status: 400 }
            );
        }

        const updatedMenu = await prisma.menu.update({
            where: { id: id },
            data: { 
                name,
                price: numericPrice,
                categoryId: numericCategoryId,
                image: image || null,
             },
        });

        return NextResponse.json(updatedMenu);
    } catch (error: any) {
        console.error('API Error (PATCH /api/menu/[id]):', error);
        return NextResponse.json(
            { message: 'Gagal memperbarui menu.' },
            { status: 500 }
        );
    }
}