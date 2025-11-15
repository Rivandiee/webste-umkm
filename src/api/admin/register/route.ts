import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password, name } = await req.json();

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
  } catch (err) {
    return NextResponse.json({ error: "Gagal membuat admin" }, { status: 500 });
  }
}
