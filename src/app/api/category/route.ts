// File: src/app/api/category/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth'; 

// GET: Daftar semua kategori (PUBLIC/UNPROTECTED)
export async function GET(request: Request) {
  // GET tidak memiliki pemeriksaan token, sehingga publik.
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error (GET /api/category):', error);
    return NextResponse.json(
      { message: 'Gagal mengambil daftar kategori. (Cek koneksi DB)' },
      { status: 500 }
    );
  }
}

// POST: Tambah kategori baru (PROTECTED)
export async function POST(request: Request) {
  const authResult = verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
  }

  try {
    // ... (Logika POST)
    const body = await request.json();
    const { name } = body;
    // ...
    const newCategory = await prisma.category.create({
      data: { name },
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error('API Error (POST /api/category):', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Kategori dengan nama ini sudah ada.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: 'Gagal menambahkan kategori.' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus kategori berdasarkan ID (PROTECTED)
export async function DELETE(request: Request) {
  const authResult = verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
  }
  
  try {
    // ... (Logika DELETE)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    // ...
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Kategori berhasil dihapus.' }, { status: 200 });
  } catch (error: any) {
    // ... (Error handling)
    return NextResponse.json(
      { message: 'Gagal menghapus kategori.' },
      { status: 500 }
    );
  }
}