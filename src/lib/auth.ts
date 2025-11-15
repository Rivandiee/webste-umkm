// File: src/lib/auth.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  username: string;
}

// Fungsi untuk memverifikasi token dari header otorisasi
export function verifyAdminToken(request: Request): { success: boolean, payload: JwtPayload | null } {
  const authHeader = request.headers.get('Authorization');
  
  // 401 Unauthorized
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, payload: null };
  }

  const token = authHeader.split(' ')[1];

  try {
    // Memerlukan JWT_SECRET di .env
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    return { success: true, payload };
  } catch (error) {
    // Token tidak valid atau kedaluwarsa
    return { success: false, payload: null };
  }
}