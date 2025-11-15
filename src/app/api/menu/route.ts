// File: src/api/menu/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth'; // Import helper otorisasi

// GET (Tidak diubah)
export async function GET() { 
    // ... (Logika GET yang sudah ada)
}

// POST: Tambah menu baru (Protected)
export async function POST(request: Request) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }
    
    try {
        // ... (Logika POST yang sudah ada)
        const body = await request.json();
        const { name, price, categoryId, image } = body;
        // ...
        const newMenu = await prisma.menu.create({
            data: { /* ... */ },
        });
        return NextResponse.json(newMenu, { status: 201 });
    } catch (error) {
        // ... (Error handling)
    }
}

// DELETE: Hapus menu berdasarkan ID (Protected)
export async function DELETE(request: Request) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }

    try {
        // ... (Logika DELETE yang sudah ada)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        // ...
        await prisma.menu.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Menu berhasil dihapus.' }, { status: 200 });
    } catch (error: any) {
        // ... (Error handling)
    }
}