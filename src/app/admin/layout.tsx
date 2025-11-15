// File: src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Utensils,
  Layers,
  ShoppingCart,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. Cek token di client
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin_login"); 
    } else {
      // Di aplikasi nyata, Anda harus memvalidasi token ke API /api/admin/verify
      // Untuk demo cepat, kita asumsikan token ada = authenticated.
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, [router]);

  // Tampilkan loading saat cek otentikasi
  if (isCheckingAuth) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Memeriksa Akses...</div>;
  }
  
  // Jika tidak terotentikasi, jangan render konten (sudah di-redirect)
  if (!isAuthenticated) {
    return null;
  }
  
  // ... (Menu items dan render logic tetap sama) ...
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin/dashboard" },
    { name: "Menu", icon: <Utensils size={18} />, href: "/admin/menu" },
    { name: "Kategori", icon: <Layers size={18} />, href: "/admin/category" },
    { name: "Pesanan", icon: <ShoppingCart size={18} />, href: "/admin/order" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, idx) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-100"
                  }
                `}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1">
        <div className="w-full bg-white shadow-md p-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">
            Panel Administrator
          </h1>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}