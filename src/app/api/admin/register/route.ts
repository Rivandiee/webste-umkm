// File: src/app/api/admin/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma"; // <-- DIUBAH: Impor prisma singleton

// const prisma = new PrismaClient(); // <-- DIHAPUS: Baris ini tidak dipakai lagi

export async function POST(req: Request) {
  try {
    const { username, password, name } = await req.json();

    if (!username || !password || !name) { // <-- DITAMBAH: Validasi input
      return NextResponse.json({ error: "Semua data wajib diisi" }, { status: 400 });
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
  } catch (err: any) { // <-- DITAMBAH: Penanganan error duplikat
    if (err.code === 'P2002' && err.meta?.target?.includes('username')) {
      return NextResponse.json({ error: "Username ini sudah terdaftar" }, { status: 409 });
    }
    console.error("Register API Error:", err); // <-- DITAMBAH: Logging error
    return NextResponse.json({ error: "Gagal membuat admin" }, { status: 500 });
  }
}