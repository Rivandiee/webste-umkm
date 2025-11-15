// File: src/app/admin/menu/add/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export default function AddMenuPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    image: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil daftar kategori untuk dropdown
  useEffect(() => {
    // GET API category tidak diproteksi
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
        setError("Gagal memuat kategori. Pastikan database berjalan.");
      }
    };
    fetchCategories();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const numericPrice = parseInt(form.price);

    // --- VALIDASI KUAT DI FRONTEND ---
    if (isNaN(numericPrice) || numericPrice <= 0) {
        setError("Harga harus berupa angka yang valid dan positif.");
        setIsLoading(false);
        return;
    }
    if (!form.name.trim() || !form.categoryId) {
        setError("Nama menu dan kategori wajib diisi.");
        setIsLoading(false);
        return;
    }
    // --- AKHIR VALIDASI KUAT ---
    
    // AMBIL TOKEN DARI LOCAL STORAGE (Wajib untuk POST)
    const token = localStorage.getItem('admin_token');
    if (!token) {
        setError("Sesi Anda habis. Silakan refresh dan login ulang.");
        setIsLoading(false);
        return;
    }

    const payload = {
      ...form,
      price: numericPrice, // Menggunakan integer yang sudah divalidasi
    };

    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // <--- FIX KRITIS: MENGIRIM TOKEN ADMIN
        },
        body: JSON.stringify(payload),
      });
      
      if (response.status === 401) {
          throw new Error("Sesi login Anda habis atau tidak valid. Silakan login ulang.");
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Gagal menambahkan menu. Terjadi kesalahan pada server." }));
        throw new Error(errorData.message || "Gagal menambahkan menu. Terjadi kesalahan pada server.");
      }

      alert("Menu berhasil ditambahkan!");
      router.push("/admin/menu");
      
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Menu</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">
                Error: {error}
            </p>
        )}
        
        <input
          type="text"
          placeholder="Nama Menu"
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setValue("name", e.target.value)}
          disabled={isLoading}
        />

        <input
          type="number"
          placeholder="Harga (misal: 25000)"
          className="w-full border p-3 rounded"
          value={form.price}
          onChange={(e) => setValue("price", e.target.value)}
          disabled={isLoading}
        />

        <select
          className="w-full border p-3 rounded"
          value={form.categoryId}
          onChange={(e) => setValue("categoryId", e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="URL Gambar"
          className="w-full border p-3 rounded"
          value={form.image}
          onChange={(e) => setValue("image", e.target.value)}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-3 rounded-lg disabled:bg-green-400 transition"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Menu"}
        </button>
      </form>
    </div>
  );
}