// File: src/app/admin/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MenuItem {
  id: string; // Ubah ke string untuk UUID
  name: string;
  price: number;
  category: { name: string }; // Asumsikan object Category yang sudah direlasikan
}

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu"); // GET /api/menu
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Gagal mengambil data menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus menu ini?")) {
      try {
        const response = await fetch(`/api/menu?id=${id}`, {
          method: "DELETE", // DELETE /api/menu?id=...
        });

        if (!response.ok) {
          throw new Error("Gagal menghapus menu.");
        }

        // Perbarui state lokal dengan memfilter item yang dihapus
        setMenu(menu.filter((item) => item.id !== id));
        alert("Menu berhasil dihapus!");
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  if (isLoading) {
    return <div className="p-6">Memuat Daftar Menu...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Menu</h1>

        <Link
          href="/admin/menu/add"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Tambah Menu
        </Link>
      </div>

      <table className="w-full border text-left bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Nama</th>
            <th className="p-3 border">Harga</th>
            <th className="p-3 border">Kategori</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td className="p-3 border">{item.name}</td>
              <td className="p-3 border">Rp {item.price.toLocaleString()}</td>
              <td className="p-3 border">{item.category?.name || 'N/A'}</td>

              <td className="p-3 border flex gap-2">
                <Link
                  href={`/admin/menu/edit/${item.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}