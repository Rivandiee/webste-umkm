// File: src/app/admin_login/page.tsx
"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Pastikan API Login berada di src/app/api/admin/login/route.ts
      const response = await fetch("/api/admin/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login gagal, kredensial salah.");
      }

      const result = await response.json();
      
      // Simpan Token di Local Storage
      localStorage.setItem("admin_token", result.token);

      // Redirect ke Dashboard setelah login sukses
      window.location.href = "/admin/dashboard";

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        
        {error && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>
        )}

        <input
          type="text"
          placeholder="Username"
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
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </div>
    </div>
  );
}