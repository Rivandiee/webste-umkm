// File: src/app/api/category/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth'; 

// 1. GET: Daftar semua kategori (PUBLIC/UNPROTECTED)
// ... (Fungsi GET tidak berubah)
export async function GET(request: Request) {
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

// 2. POST: Tambah kategori baru (PROTECTED)
// ... (Fungsi POST tidak berubah)
export async function POST(request: Request) {
  const authResult = verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { message: 'Nama kategori wajib diisi.' },
        { status: 400 }
      );
    }

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


// 3. DELETE: Hapus kategori berdasarkan ID (PROTECTED)
export async function DELETE(request: Request) {
  const authResult = verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const idString = searchParams.get('id');

    if (!idString) {
      return NextResponse.json(
        { message: 'ID kategori wajib diisi.' },
        { status: 400 }
      );
    }

    // --- PERBAIKAN VALIDASI ---
    const idNum = Number(idString); // "1" -> 1, "1.1" -> 1.1
    if (isNaN(idNum) || !Number.isInteger(idNum)) { // Cek float/NaN
        return NextResponse.json({ message: 'ID Kategori tidak valid.' }, { status: 400 });
    }
    // --- AKHIR PERBAIKAN ---

    await prisma.category.delete({
      where: { id: idNum }, // Gunakan idNum
    });

    return NextResponse.json({ message: 'Kategori berhasil dihapus.' }, { status: 200 });
  } catch (error: any) {
    console.error('API Error (DELETE /api/category):', error);
    if (error.code === 'P2003') {
      return NextResponse.json(
        { message: 'Gagal menghapus: Kategori ini masih digunakan oleh Menu.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: 'Gagal menghapus kategori.' },
      { status: 500 }
    );
  }
}