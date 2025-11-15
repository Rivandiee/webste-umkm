// File: src/app/admin/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <-- DITAMBAH

interface MenuItem {
  id: number; // <-- DIUBAH
  name: string;
  price: number;
  category: { name: string }; // Asumsikan object Category yang sudah direlasikan
}

export default function AdminMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // <-- DITAMBAH

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

  const handleDelete = async (id: number) => { // <-- DIUBAH
    if (confirm("Yakin ingin menghapus menu ini?")) {
      
      // --- PERBAIKAN PENTING: Ambil Token ---
      const token = localStorage.getItem('admin_token');
      if (!token) {
          alert("Sesi login Anda habis. Silakan refresh dan login ulang.");
          router.push("/admin_login"); 
          return;
      }
      // --- Akhir Perbaikan ---

      try {
        const response = await fetch(`/api/menu?id=${id}`, {
          method: "DELETE", // DELETE /api/menu?id=...
          headers: { // <-- DITAMBAH: Kirim token
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) { // <-- DITAMBAH: Penanganan token
            throw new Error("Akses Ditolak: Sesi login habis.");
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Gagal menghapus menu." }));
          throw new Error(errorData.message || "Gagal menghapus menu.");
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
                  href={`/admin/menu/edit/${item.id}`} // item.id sudah number
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(item.id)} // item.id sudah number
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {menu.length === 0 && !isLoading && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Belum ada menu yang ditambahkan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}