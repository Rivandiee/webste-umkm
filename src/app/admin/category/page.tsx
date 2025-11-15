// File: src/app/admin/category/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Category {
  id: string; 
  name: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/category"); // GET /api/category
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data kategori.");
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    try {
      const response = await fetch(`/api/category?id=${id}`, {
        method: "DELETE", // DELETE /api/category?id=...
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus kategori. Mungkin sedang digunakan oleh Menu.");
      }

      setCategories(categories.filter((cat) => cat.id !== id));
      alert("Kategori berhasil dihapus!");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kelola Kategori</h1>

        <Link
          href="/admin/category/add"
          className="bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} />
          Tambah Kategori
        </Link>
      </div>
      
      {isLoading && <p className="text-gray-600">Memuat data...</p>}
      {error && <p className="p-3 text-red-700 bg-red-100 border border-red-300 rounded">Error: {error}</p>}
      
      {!isLoading && !error && (
        <div className="bg-white rounded-xl shadow">
          <table className="w-full border-collapse">
            {/* ... (thead remains the same) ... */}
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Nama Kategori</th>
                <th className="p-3 text-center w-32">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b">
                  <td className="p-3">{cat.name}</td>

                  <td className="p-3 flex items-center justify-center gap-3">
                    {/* Edit button */}
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit Kategori"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Delete button */}
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Hapus Kategori"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    className="p-4 text-gray-500 text-center"
                    colSpan={2}
                  >
                    Belum ada kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}