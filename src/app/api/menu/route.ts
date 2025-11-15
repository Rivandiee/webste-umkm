// File: src/app/api/menu/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth'; 

// GET: Daftar semua menu (PUBLIC/UNPROTECTED)
export async function GET() { 
    try {
        const menuItems = await prisma.menu.findMany({
            include: {
                category: { 
                    select: { name: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        const formattedMenu = menuItems.map(item => ({
            ...item,
            category: item.category,
        }));
        
        return NextResponse.json(formattedMenu);
    } catch (error) {
        console.error('API Error (GET /api/menu):', error);
        return NextResponse.json(
            { message: 'Gagal mengambil daftar menu. (Cek koneksi DB)' },
            { status: 500 }
        );
    }
}

// POST: Tambah menu baru (PROTECTED)
export async function POST(request: Request) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }
    
    try {
        const body = await request.json();
        const { name, price, categoryId, image } = body;

        if (!name || !price || !categoryId) {
            return NextResponse.json(
                { message: 'Nama, harga, dan kategori wajib diisi.' },
                { status: 400 }
            );
        }

        const newMenu = await prisma.menu.create({
            data: {
                name,
                price: Number(price), // Konversi harga ke angka
                categoryId,
                image: image || null,
            },
        });

        return NextResponse.json(newMenu, { status: 201 });
    } catch (error: any) {
        console.error('API Error (POST /api/menu):', error);
        return NextResponse.json(
            { message: 'Gagal menambahkan menu.' },
            { status: 500 }
        );
    }
}

// DELETE: Hapus menu berdasarkan ID (Protected)
export async function DELETE(request: Request) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'ID menu wajib diisi.' },
                { status: 400 }
            );
        }

        await prisma.menu.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Menu berhasil dihapus.' }, { status: 200 });
    } catch (error: any) {
        console.error('API Error (DELETE /api/menu):', error);
        if (error.code === 'P2003') {
            return NextResponse.json(
                { message: 'Gagal menghapus: Menu ini sudah ada dalam pesanan.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: 'Gagal menghapus menu.' },
            { status: 500 }
        );
    }
}