// File: src/app/admin/category/add/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategory() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
        setError("Nama kategori tidak boleh kosong.");
        setIsLoading(false);
        return;
    }
    
    const token = localStorage.getItem('admin_token');
    if (!token) {
        setError("Sesi login habis. Silakan login ulang.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ name }),
      });

      if (response.status === 401) {
          throw new Error("Akses Ditolak: Token tidak valid.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Gagal menambahkan kategori." }));
        throw new Error(errorData.message || "Gagal menambahkan kategori. Terjadi kesalahan pada server.");
      }
      
      alert(`Kategori "${name}" berhasil ditambahkan!`);
      router.push("/admin/category");

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Kategori</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">
                Error: {error}
            </p>
        )}
        
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Kategori
          </label>
          <input
            id="categoryName"
            type="text"
            placeholder="Nama Kategori"
            className="w-full border p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg disabled:bg-blue-400 transition"
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Kategori"}
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