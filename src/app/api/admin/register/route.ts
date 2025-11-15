// File: src/app/api/admin/register/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient(); // Asumsi: Anda sudah menginstal prisma dan bcrypt

export async function POST(req: Request) {
  try {
    const { username, password, name } = await req.json();

    if (!username || !password || !name) {
        return NextResponse.json({ error: "Username, password, dan nama wajib diisi." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashed,
        name
      },
    });

    return NextResponse.json({
      message: "Admin berhasil dibuat",
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err: any) { // Menggunakan 'any' untuk mengakses 'err.code'
    console.error("Registrasi Error:", err); // Log error di server

    // FIX KRITIS: Tangani jika username sudah ada (Unique constraint violation)
    if (err.code === 'P2002' && err.meta?.target?.includes('username')) {
        return NextResponse.json(
            { error: "Username ini sudah terdaftar. Silakan gunakan username lain." },
            { status: 409 } // 409 Conflict
        );
    }

    return NextResponse.json({ error: "Gagal membuat admin" }, { status: 500 });
  }
}