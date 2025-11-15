// File: src/app/api/admin/login/route.ts (DIRELOKASI & DIRENAME dari router.ts)
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Menggunakan PrismaClient lokal (non-singleton) untuk file ini, atau ganti dengan import prisma dari @/lib/prisma
const prisma = new PrismaClient(); // Asumsi: Anda sudah menginstal prisma dan bcrypt

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return NextResponse.json({ error: "Username tidak ditemukan" }, { status: 401 });
    }

    // Bandingkan password yang dimasukkan dengan hash di database
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Membuat JWT token (membutuhkan JWT_SECRET di .env)
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET!, 
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login berhasil",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    });
  } catch (err) {
    // Gunakan log yang lebih spesifik untuk debugging di server
    console.error("Login API Error:", err);
    return NextResponse.json({ error: "Login gagal" }, { status: 500 });
  }
}