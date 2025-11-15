"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminMenuPage() {
  const [menu, setMenu] = useState([
    { id: 1, name: "Nasi Goreng", price: 25000, category: "makanan" },
    { id: 2, name: "Es Teh Manis", price: 5000, category: "minuman" },
    { id: 3, name: "Mie Ayam", price: 20000, category: "makanan" },
  ]);

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus menu ini?")) {
      setMenu(menu.filter((item) => item.id !== id));
    }
  };

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
              <td className="p-3 border">{item.category}</td>

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
