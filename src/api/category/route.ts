// File: src/app/api/category/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

// GET: Daftar semua kategori
export async function GET() {
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
      { message: 'Gagal mengambil daftar kategori.' },
      { status: 500 }
    );
  }
}

// POST: Tambah kategori baru
export async function POST(request: Request) {
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

// DELETE: Hapus kategori berdasarkan ID (menggunakan URL Query Parameter)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'ID kategori wajib diisi.' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
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