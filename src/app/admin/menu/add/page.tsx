"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMenuPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Menu berhasil ditambahkan!");

    // Redirect kembali ke halaman menu
    router.push("/admin/menu");
  };

  const setValue = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tambah Menu</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">

        <input
          type="text"
          placeholder="Nama Menu"
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setValue("name", e.target.value)}
        />

        <input
          type="number"
          placeholder="Harga"
          className="w-full border p-3 rounded"
          value={form.price}
          onChange={(e) => setValue("price", e.target.value)}
        />

        <select
          className="w-full border p-3 rounded"
          value={form.category}
          onChange={(e) => setValue("category", e.target.value)}
        >
          <option value="">-- Pilih Kategori --</option>
          <option value="makanan">Makanan</option>
          <option value="minuman">Minuman</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
        </select>

        <input
          type="text"
          placeholder="URL Gambar"
          className="w-full border p-3 rounded"
          value={form.image}
          onChange={(e) => setValue("image", e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-3 rounded-lg"
        >
          Simpan Menu
        </button>
      </form>
    </div>
  );
}
