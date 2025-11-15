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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* --- FIX KRITIS: Tombol Edit Baru --- */}
                    <Link 
                      // Mengarahkan ke halaman edit dengan ID yang sesuai
                      href={`/admin/category/${category.id}/edit`} 
                      className="text-blue-600 hover:text-blue-900 mr-4 font-semibold"
                    >
                      Edit
                    </Link>
                    {/* --- Akhir FIX KRITIS --- */}
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}