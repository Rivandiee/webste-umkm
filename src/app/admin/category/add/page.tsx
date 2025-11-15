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

    // --- VALIDASI TAMBAHAN ---
    if (!name.trim()) {
        setError("Nama kategori tidak boleh kosong.");
        setIsLoading(false);
        return;
    }
    // --- AKHIR VALIDASI TAMBAHAN ---

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        // Pastikan error body di-parse untuk pesan yang lebih spesifik
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
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
      <h1 className="text-2xl mb-4">Tambah Kategori</h1>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
          Error: {error}
        </div>
      )}

      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Nama kategori..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        disabled={isLoading}
      />

      <button 
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400 transition"
        disabled={isLoading}
      >
        {isLoading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}