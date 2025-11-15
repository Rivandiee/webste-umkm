"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategory() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/category", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    router.push("/admin/category");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
      <h1 className="text-2xl mb-4">Tambah Kategori</h1>

      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Nama kategori..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Simpan
      </button>
    </form>
  );
}
