// File: src/app/user/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

interface OrderSummary {
  id: number;
  totalPrice: number;
  items: OrderItem[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isPaying, setIsPaying] = useState<boolean>(false);

  // --- Fetch Order Summary dari API ---
  useEffect(() => {
    if (!orderId) {
      setError("Order ID tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/order/${orderId}`);
        if (!res.ok) throw new Error("Gagal mengambil data pesanan.");
        const data: OrderSummary = await res.json();
        setOrderSummary(data);
      } catch (e: any) {
        setError(e.message || "Terjadi kesalahan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // --- Submit Payment ---
  const handlePaymentSubmission = async () => {
    if (!orderSummary) return;
    setIsPaying(true);
    setError(null);

    try {
      const res = await fetch(`/api/order/${orderSummary.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Gagal melakukan pembayaran." }));
        throw new Error(errorData.message || "Gagal melakukan pembayaran.");
      }
      const result = await res.json();
      alert("Pembayaran berhasil! Terima kasih.");
      router.push("/user/menu"); // Redirect ke menu setelah bayar
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsPaying(false);
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-100">
        <p className="text-gray-500 text-lg font-medium animate-pulse">Memuat ringkasan pesanan...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error || !orderSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-100 p-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-200 text-center">
          <p className="text-red-600 font-semibold mb-4">Error: {error || "Order tidak ditemukan."}</p>
          <button
            onClick={() => router.push("/user/menu")}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  // --- Main Checkout JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 p-6 flex justify-center">
      <div className="w-full max-w-lg space-y-6">

        <h1 className="text-3xl font-extrabold text-slate-800 text-center tracking-wide">
          Checkout
        </h1>

        {/* Order Summary Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Ringkasan Pesanan #{orderSummary.id}</h2>

          <div className="space-y-3">
            {orderSummary.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">{item.qty} x {item.price.toLocaleString()} IDR</p>
                </div>
                <p className="font-semibold">{(item.qty * item.price).toLocaleString()} IDR</p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-xl text-blue-600">{orderSummary.totalPrice.toLocaleString()} IDR</span>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <label className="block mb-2 font-medium text-gray-700">Metode Pembayaran</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option value="cash">Tunai</option>
              <option value="credit">Kartu Kredit</option>
              <option value="e-wallet">E-Wallet</option>
            </select>
          </div>

          {/* Order Note */}
          <div className="mt-4">
            <label className="block mb-2 font-medium text-gray-700">Catatan Pesanan (opsional)</label>
            <textarea
              placeholder="Tambahkan catatan..."
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          {/* Checkout Button */}
          <button
            onClick={handlePaymentSubmission}
            disabled={isPaying}
            className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPaying ? "Memproses Pembayaran..." : "Bayar Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}
