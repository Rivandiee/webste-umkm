// File: src/app/admin/menu/[id]/edit/page.tsx (Diperbarui)
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image"; // Gunakan Next/Image untuk preview

interface Category {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  image: string | null;
}

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    image: "", // Akan diisi dengan URL gambar yang ada
  });
  const [file, setFile] = useState<File | null>(null); // State untuk file *baru*
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Ambil Kategori (tidak berubah)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        setCategories(await res.json());
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Ambil data menu yang akan di-edit (tidak berubah)
  useEffect(() => {
    if (!id) return;
    const fetchMenuData = async () => {
      setIsFetchingData(true);
      const token = localStorage.getItem('admin_token');
      if (!token) {
          router.replace("/admin_login");
          return;
      }
      try {
        const res = await fetch(`/api/menu/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Gagal memuat data menu.");
        const data: MenuItem = await res.json();
        setForm({
            name: data.name,
            price: data.price.toString(),
            categoryId: data.categoryId.toString(),
            image: data.image || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchMenuData();
  }, [id, router]);

  // 3. Fungsi baru untuk upload file (sama seperti add page)
  const uploadFile = async (token: string): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal upload file.");
      }
      const data = await res.json();
      return data.url;
    } catch (e: any) {
      setError(`Upload Gagal: ${e.message}`);
      return null;
    }
  };


  // 4. Handle Submit (Diperbarui)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validasi (tidak berubah)
    const numericPrice = parseInt(form.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
        setError("Harga harus berupa angka yang valid.");
        setIsLoading(false);
        return;
    }
    if (!form.name.trim() || !form.categoryId) {
        setError("Nama menu dan kategori wajib diisi.");
        setIsLoading(false);
        return;
    }
    
    // Token (tidak berubah)
    const token = localStorage.getItem('admin_token');
    if (!token) {
        setError("Sesi Anda habis.");
        setIsLoading(false);
        return;
    }

    // --- LOGIKA UPLOAD BARU (EDIT) ---
    let imageUrl = form.image; // Mulai dengan gambar yang sudah ada

    // Jika admin memilih file *baru*, upload file itu
    if (file) {
      const uploadedUrl = await uploadFile(token);
      if (uploadedUrl) {
        imageUrl = uploadedUrl; // Ganti imageUrl dengan hasil upload baru
      } else {
        // Gagal upload, hentikan proses
        setIsLoading(false);
        return; 
      }
    }
    // --- AKHIR LOGIKA UPLOAD ---

    const payload = {
      ...form,
      price: numericPrice,
      categoryId: Number(form.categoryId),
      image: imageUrl || null, // Kirim URL (baru atau lama)
    };

    try {
      // Panggil API PATCH (tidak berubah)
      const response = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      if (response.status === 401) throw new Error("Sesi login Anda habis.");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Gagal memperbarui menu." }));
        throw new Error(errorData.message);
      }

      alert("Menu berhasil diperbarui!");
      router.push("/admin/menu");
      
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setValue = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  if (isFetchingData) {
      return <div className="p-6 text-center">Memuat data menu...</div>
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Menu</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        {error && (
            <p className="text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">
                Error: {error}
            </p>
        )}
        
        {/* Input Form (tidak berubah) */}
        <input
          type="text"
          placeholder="Nama Menu"
          className="w-full border p-3 rounded"
          value={form.name}
          onChange={(e) => setValue("name", e.target.value)}
          disabled={isLoading}
        />
        <input
          type="number"
          placeholder="Harga (misal: 25000)"
          className="w-full border p-3 rounded"
          value={form.price}
          onChange={(e) => setValue("price", e.target.value)}
          disabled={isLoading}
        />
        <select
          className="w-full border p-3 rounded"
          value={form.categoryId}
          onChange={(e) => setValue("categoryId", e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* --- INPUT GAMBAR DIPERBARUI (EDIT) --- */}
        <div className="border p-3 rounded-lg space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Gambar Menu
            </label>
            
            {/* Preview Gambar yang Ada */}
            {form.image && !file && (
              <div className="w-full h-40 relative rounded overflow-hidden">
                <Image 
                  src={form.image} 
                  alt="Preview" 
                  layout="fill" 
                  objectFit="cover" 
                  className="bg-gray-200"
                />
              </div>
            )}
            {/* Preview File Baru yang Dipilih */}
            {file && (
                <p className="text-sm text-blue-600">File baru dipilih: {file.name}</p>
            )}

            <label className="block text-sm font-medium text-gray-700 pt-2">
              Ganti Gambar (Upload)
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="w-full text-sm file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              disabled={isLoading}
            />
            
            <p className="text-center text-gray-500 text-xs my-2">ATAU</p>
            
            <label className="block text-sm font-medium text-gray-700">
              Ganti dengan URL Gambar
            </label>
            <input
              type="text"
              placeholder="Masukkan URL Gambar baru"
              className="w-full border p-3 rounded"
              value={form.image}
              onChange={(e) => setValue("image", e.target.value)}
              disabled={isLoading || !!file} // Disable jika sedang upload file
            />
        </div>
        {/* --- AKHIR INPUT GAMBAR --- */}


        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg disabled:bg-blue-400 transition"
          disabled={isLoading}
        >
          {isLoading ? "Memperbarui..." : "Perbarui Menu"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/menu")}
          className="bg-gray-500 text-white w-full py-3 rounded-lg mt-2 transition hover:bg-gray-600"
          disabled={isLoading}
        >
          Batal
        </button>
      </form>
    </div>
  );
}