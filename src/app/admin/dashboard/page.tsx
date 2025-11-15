// File: src/app/admin/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";

interface DashboardStats {
  totalMenu: number;
  dailyOrders: number;
  newOrders: number;
}

interface Order {
  id: number;
  name: string;
  item: string;
  status: 'baru' | 'diproses' | 'selesai';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch("/api/dashboard/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      const ordersRes = await fetch("/api/dashboard/recent-orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      // Fallback atau tampilkan pesan error ke user
      setStats({ totalMenu: 0, dailyOrders: 0, newOrders: 0 }); 
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-6">Memuat Dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Menu</p>
          <h2 className="text-3xl font-bold">{stats?.totalMenu}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pesanan Hari Ini</p>
          <h2 className="text-3xl font-bold">{stats?.dailyOrders}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pesanan Baru</p>
          <h2 className="text-3xl font-bold text-red-600">{stats?.newOrders}</h2>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Notifikasi Pesanan</h2>

      <div className="bg-white rounded-xl p-4 shadow">
        {orders.length > 0 ? orders.map((o) => (
          <div
            key={o.id}
            className="border-b py-3 flex justify-between items-center"
          >
            {/* ... (existing display logic) */}
            <div>
              <p className="font-semibold">{o.name}</p>
              <p className="text-sm text-gray-500">{o.item}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                o.status === "baru"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {o.status}
            </span>
          </div>
        )) : <p className="text-gray-500">Tidak ada pesanan baru.</p>}
      </div>
    </div>
  );
}