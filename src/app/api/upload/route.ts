// File: src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { verifyAdminToken } from '@/lib/auth'; // Ambil verifikasi token Anda

export async function POST(request: Request) {
  // 1. Verifikasi apakah ini admin
  const authResult = verifyAdminToken(request);
  if (!authResult.success) {
    return NextResponse.json({ message: 'Akses Ditolak' }, { status: 401 });
  }

  // 2. Ambil FormData dari request
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ message: 'Tidak ada file yang di-upload.' }, { status: 400 });
  }

  // 3. Ubah file menjadi Buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 4. Buat nama file yang unik
  const fileExtension = file.name.split('.').pop();
  const uniqueFilename = `${randomUUID()}.${fileExtension}`;

  // 5. Tentukan path penyimpanan di public/uploads
  // process.cwd() mengarah ke root folder proyek Anda
  const savePath = join(process.cwd(), 'public', 'uploads', uniqueFilename);

  try {
    // 6. Tulis file ke server
    await writeFile(savePath, buffer);
    
    // 7. Kembalikan URL publik dari file yang baru disimpan
    const publicUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("Error saat menyimpan file:", error);
    return NextResponse.json({ message: 'Gagal menyimpan file di server.' }, { status: 500 });
  }
}