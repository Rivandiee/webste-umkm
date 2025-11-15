// File: src/app/admin_register/page.tsx (NEW FILE)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    // Validasi dasar
    if (!username || !password || !name) {
        setError("Semua kolom wajib diisi.");
        setLoading(false);
        return;
    }

    try {
      // Panggil API registrasi (src/app/api/admin/register/route.ts)
      const response = await fetch("/api/admin/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registrasi gagal.");
      }

      alert("Registrasi Admin Berhasil! Silakan masuk.");
      // Redirect ke halaman login setelah berhasil
      router.push("/admin_login");

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registrasi Admin</h1>
        
        {error && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}

        <input
          type="text"
          placeholder="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-3"
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Username (ID Login)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-3"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-5"
          disabled={loading}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
          disabled={loading}
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>

        <p className="text-center text-sm mt-3 text-gray-600">
            Sudah punya akun? <a href="/admin_login" className="text-blue-600 hover:underline">Masuk</a>
        </p>
      </div>
    </div>
  );
}