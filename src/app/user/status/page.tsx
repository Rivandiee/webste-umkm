// File: src/app/user/status/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Package } from "lucide-react";

type OrderStatus = "pending" | "processing" | "ready" | "completed";

export default function StatusPage() {
  const [status, setStatus] = useState<OrderStatus>("processing");
  const [progressText, setProgressText] = useState("Mohon tunggu, pesanan Anda sedang disiapkan.");

  // Simulasi update status (bisa diganti fetch API nyata)
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("ready");
      setProgressText("Pesanan Anda hampir siap! Silakan bersiap mengambilnya.");
    }, 5000); // 5 detik simulasi
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "text-gray-500 bg-gray-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "ready":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="w-12 h-12 animate-pulse mx-auto" />;
      case "processing":
        return <Package className="w-12 h-12 animate-spin-slow mx-auto" />;
      case "ready":
        return <Package className="w-12 h-12 mx-auto" />;
      case "completed":
        return <CheckCircle className="w-12 h-12 mx-auto" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Status Pesanan</h1>

      <div className={`bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4`}>
        <div className={`${getStatusColor()} p-4 rounded-xl flex flex-col items-center`}>
          {getStatusIcon()}
          <h2 className="font-bold text-xl mt-2 capitalize">{status.replace("-", " ")}</h2>
          <p className="text-slate-600 mt-1">{progressText}</p>
        </div>

        {/* Optional: Ringkasan Pesanan */}
        <div className="mt-4 text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-semibold mb-2">Ringkasan Pesanan</h3>
          <ul className="list-disc list-inside text-slate-700">
            <li>Nasi Goreng Special x1</li>
            <li>Es Teh Manis x2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
