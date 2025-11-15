// File: src/app/api/category/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// 1. GET: Ambil detail kategori by ID (Protected)
// PERBAIKAN: Mengubah cara 'context' diterima menjadi '{ params }'
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }
    
    try {
        // PERBAIKAN: Validasi ID yang lebih ketat
        const idNum = Number(params.id); // "1" -> 1, "1.1" -> 1.1, "abc" -> NaN
        
        // Cek apakah NaN ATAU bukan integer
        if (isNaN(idNum) || !Number.isInteger(idNum)) {
            return NextResponse.json({ message: 'ID Kategori tidak valid.' }, { status: 400 });
        }
        // --- AKHIR PERBAIKAN ---
        
        const category = await prisma.category.findUnique({
            where: { id: idNum }, // Gunakan idNum yang sudah valid
            select: { id: true, name: true },
        });

        if (!category) {
            return NextResponse.json({ message: 'Kategori tidak ditemukan.' }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error) {
        console.error('API Error (GET /api/category/[id]):', error);
        return NextResponse.json(
            { message: 'Gagal mengambil detail kategori.' },
            { status: 500 }
        );
    }
}

// 2. PATCH: Update kategori by ID (Protected)
// PERBAIKAN: Mengubah cara 'context' diterima menjadi '{ params }'
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const authResult = verifyAdminToken(request);
    if (!authResult.success) {
        return NextResponse.json({ message: 'Akses Ditolak: Diperlukan otentikasi admin.' }, { status: 401 });
    }

    try {
        // PERBAIKAN: Validasi ID yang lebih ketat
        const idNum = Number(params.id); 
        
        if (isNaN(idNum) || !Number.isInteger(idNum)) {
            return NextResponse.json({ message: 'ID Kategori tidak valid.' }, { status: 400 });
        }
        // --- AKHIR PERBAIKAN ---

        const body = await request.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json(
                { message: 'Nama kategori wajib diisi.' },
                { status: 400 }
            );
        }

        const updatedCategory = await prisma.category.update({
            where: { id: idNum }, // Gunakan idNum yang sudah valid
            data: { name },
        });

        return NextResponse.json(updatedCategory);
    } catch (error: any) {
        console.error('API Error (PATCH /api/category/[id]):', error);
        if (error.code === 'P2002') {
             return NextResponse.json(
                { message: 'Kategori dengan nama ini sudah ada.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: 'Gagal memperbarui kategori.' },
            { status: 500 }
        );
    }
}