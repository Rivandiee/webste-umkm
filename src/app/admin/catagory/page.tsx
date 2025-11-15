"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function CategoryPage() {
  // Dummy data kategori
  const [categories, setCategories] = useState([
    { id: 1, name: "Makanan" },
    { id: 2, name: "Minuman" },
    { id: 3, name: "Snack" },
  ]);

  const [newCategory, setNewCategory] = useState("");

  // Tambah kategori
  const addCategory = () => {
    if (!newCategory.trim()) return;

    setCategories([
      ...categories,
      { id: Date.now(), name: newCategory.trim() },
    ]);

    setNewCategory("");
  };

  // Hapus kategori
  const deleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Kelola Kategori</h1>

      {/* Box Tambah Kategori */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-3">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nama kategori baru..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <button
          onClick={addCategory}
          className="bg-green-600 text-white flex items-center gap-2 px-4 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} />
          Tambah
        </button>
      </div>

      {/* Daftar Kategori */}
      <div className="bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
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
                  {/* Edit button (belum diaktifkan) */}
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
    </div>
  );
}
