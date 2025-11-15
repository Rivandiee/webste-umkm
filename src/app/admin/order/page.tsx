// File: src/app/admin/order/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  id: number; // <-- DIUBAH
  name: string;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'DONE'; // Menggunakan ENUM dari Prisma
  time: string; // Atau DateTime object
}

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusColor = {
    PENDING: "bg-yellow-500",
    PREPARING: "bg-blue-500",
    DONE: "bg-green-600",
  };
  
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order/list"); // GET /api/order/list
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="p-6">Memuat Daftar Pesanan...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Pesanan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/order/${order.id}`} // order.id sudah number
            className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-xl transition block"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-bold text-lg">Pesanan #{order.id}</h2> {/* <-- DIUBAH (dihilangkan substring) */}
              <span
                className={`text-xs text-white px-3 py-1 rounded-full ${statusColor[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-gray-700 font-medium">{order.name}</p>
            <p className="text-gray-500 text-sm">{order.time}</p>

            <p className="mt-4 font-bold text-green-600 text-lg">
              Rp {order.total.toLocaleString()}
            </p>
          </Link>
        ))}
        {orders.length === 0 && <p className="text-gray-500">Tidak ada pesanan.</p>}
      </div>
    </div>
  );
}