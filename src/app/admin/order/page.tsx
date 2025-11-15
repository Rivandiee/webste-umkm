"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([
    {
      id: 101,
      name: "Budi Santoso",
      total: 55000,
      status: "pending",
      time: "10:24 AM",
    },
    {
      id: 102,
      name: "Siti Rahma",
      total: 76000,
      status: "diproses",
      time: "11:10 AM",
    },
    {
      id: 103,
      name: "Agus Setiawan",
      total: 32000,
      status: "selesai",
      time: "12:45 PM",
    },
  ]);

  const statusColor = {
    pending: "bg-yellow-500",
    diproses: "bg-blue-500",
    selesai: "bg-green-600",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Pesanan</h1>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/order/${order.id}`}
            className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-xl transition block"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-bold text-lg">Pesanan #{order.id}</h2>
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
      </div>
    </div>
  );
}
