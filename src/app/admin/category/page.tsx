// File: src/app/admin/category/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation"; 

interface Category {
  id: number;
  name: string;
}

export default function CategoryPage() {
  const router = useRouter(); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category"); 
      
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

  const deleteCategory = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    const token = localStorage.getItem('admin_token');
    if (!token) {
        alert("Sesi login Anda habis. Silakan refresh dan login ulang.");
        router.push("/admin_login"); 
        return;
    }

    try {
      const response = await fetch(`/api/category?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.status === 401) {
          throw new Error("Akses Ditolak: Sesi login habis.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Gagal menghapus kategori." }));
        throw new Error(errorData.message || "Gagal menghapus kategori. Mungkin sedang digunakan oleh Menu.");
      }

      setCategories(categories.filter((cat) => cat.id !== id));
      alert("Kategori berhasil dihapus!");
    } catch (e: any) {
      alert(e.message);
    }
  };
  
  const handleEditClick = (id: number) => {
      router.push(`/admin/category/${id}/edit`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kelola Kategori</h1>

        <Link
          href="/admin/category/add"
          className="bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} />
          Tambah Kategori
        </Link>
      </div>
      
      {isLoading && <p className="text-gray-600">Memuat data...</p>}
      {error && <p className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg">Error: {error}</p>}
      
      {!isLoading && !error && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama Kategori
                </th>
                <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-800">{cat.name}</td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(cat.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        title="Edit Kategori"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Hapus Kategori"
                        onClick={() => deleteCategory(cat.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    className="p-6 text-gray-500 text-center italic"
                    colSpan={2}
                  >
                    Belum ada kategori yang ditambahkan.
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