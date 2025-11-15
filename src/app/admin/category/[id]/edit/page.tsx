// File: src/app/admin/category/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Category {
  id: number; // <-- DIUBAH
  name: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // 'id' dari URL tetap string, ini BENAR

  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Ambil data kategori saat halaman dimuat (GET Protected)
  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        // Ambil token untuk GET request
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.replace("/admin_login"); 
            return;
        }
        
        // Memanggil API GET /api/category/[id] dengan token
        // API ini sudah kita perbaiki untuk menangani string 'id'
        const res = await fetch(`/api/category/${id}`, {
             headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
             throw new Error("Sesi Anda habis. Silakan login ulang.");
        }
        if (!res.ok) {
            throw new Error("Gagal memuat data kategori.");
        }

        const data: Category = await res.json(); // Data yang diterima id-nya number
        setCategoryName(data.name);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCategory();
  }, [id, router]);

  // Handle submit form untuk update (PATCH Protected)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const name = categoryName.trim();
    if (!name) {
        setError("Nama kategori wajib diisi.");
        setIsLoading(false);
        return;
    }
    
    // Ambil token untuk PATCH request
    const token = localStorage.getItem('admin_token');
    if (!token) {
        setError("Sesi Anda habis. Silakan refresh dan login ulang.");
        setIsLoading(false);
        return;
    }

    try {
      // Menggunakan API PATCH /api/category/[id] dengan token
      // API ini sudah kita perbaiki untuk menangani string 'id'
      const response = await fetch(`/api/category/${id}`, {
        method: "PATCH", 
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
      });
      
      if (response.status === 401) {
          throw new Error("Sesi login Anda habis atau tidak valid.");
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Gagal memperbarui kategori. Server Error." }));
        throw new Error(errorData.message || "Gagal memperbarui kategori.");
      }

      alert("Kategori berhasil diperbarui!");
      router.push("/admin/category"); 
      
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="p-6 max-w-xl mx-auto text-center">Memuat data...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Kategori</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">
                Error: {error}
            </p>
        )}
        
        <input
          type="text"
          placeholder="Nama Kategori"
          className="w-full border p-3 rounded"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          disabled={isLoading}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg disabled:bg-blue-400 transition"
          disabled={isLoading}
        >
          {isLoading ? "Memperbarui..." : "Perbarui Kategori"}
        </button>
        
        <button
          type="button"
          onClick={() => router.push("/admin/category")}
          className="bg-gray-500 text-white w-full py-3 rounded-lg mt-2 transition hover:bg-gray-600"
        >
          Batal
        </button>
      </form>
    </div>
  );
}