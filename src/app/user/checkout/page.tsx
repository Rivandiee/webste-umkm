// File: src/app/user/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Definisi interface untuk Order Summary 
interface OrderSummary {
    id: string;
    totalPrice: number;
    items: {
        name: string;
        price: number;
        qty: number;
    }[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [payment, setPayment] = useState("CASH"); // Default CASH (sesuai ENUM Prisma)
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 1. Fetch Order Summary
  useEffect(() => {
    if (!orderId) {
        setError("Order ID tidak ditemukan.");
        setIsLoading(false);
        return;
    }

    const fetchSummary = async () => {
        try {
            const res = await fetch(`/api/order/${orderId}/summary`); // GET /api/order/ORDER_ID/summary
            if (!res.ok) {
                throw new Error("Gagal mengambil ringkasan pesanan.");
            }
            const data = await res.json();
            setOrderSummary(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchSummary();
  }, [orderId]);
  
  // 2. Submit Payment Method
  const handlePaymentSubmission = async () => {
      if (!orderId || !orderSummary) return;
      
      setIsProcessingPayment(true);
      setError(null);
      
      try {
          const response = await fetch(`/api/order/${orderId}/pay`, { // POST /api/order/ORDER_ID/pay
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentMethod: payment }),
          });
          
          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ message: "Gagal memproses pembayaran." }));
              throw new Error(errorData.message || "Gagal memproses pembayaran.");
          }
          
          // Redirect berdasarkan metode pembayaran
          if (payment === "CASH") {
              router.push(`/user/status?orderId=${orderId}`);
          } else {
              router.push(`/user/payment?orderId=${orderId}`);
          }
          
      } catch (e: any) {
          setError(e.message);
      } finally {
          setIsProcessingPayment(false);
      }
  }


  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center">Memuat Ringkasan Pesanan...</div>;
  }
  
  if (error || !orderSummary) {
      return (
          <div className="min-h-screen p-6 text-center">
              <h1 className="text-xl font-bold text-red-600">Terjadi Kesalahan</h1>
              <p className="text-red-500 mt-2">{error || "Data pesanan tidak dapat dimuat."}</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 p-6 flex justify-center">
      <div className="w-full max-w-lg space-y-6">

        <h1 className="text-3xl font-extrabold text-slate-800 text-center tracking-wide">
          Checkout
        </h1>
        
        {error && (
            <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-xl">
                Error: {error}
            </div>
        )}

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Ringkasan Pesanan #{orderSummary.id.substring(0, 8)}</h2>

          <div className="space-y-3">
            {orderSummary.items.map((item, index) => (
                <div key={index} className="flex justify-between text-slate-600">
                    <span>{item.name} ({item.qty}x)</span>
                    <span>Rp {(item.price * item.qty).toLocaleString()}</span>
                </div>
            ))}

            <div className="border-t pt-3 flex justify-between font-semibold text-slate-800 text-lg">
              <span>Total</span>
              <span className="text-blue-600">Rp {orderSummary.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Metode Pembayaran</h2>

          <div className="space-y-3">
            {/* Non-Cash */}
            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="radio"
                name="pay"
                value="NONCASH" 
                checked={payment === "NONCASH"}
                onChange={() => setPayment("NONCASH")}
                className="accent-blue-600"
                disabled={isProcessingPayment}
              />
              <span className="text-slate-700 font-medium">Non-Tunai (QRIS/Transfer)</span>
            </label>

            {/* Tunai / Cash */}
            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="radio"
                name="pay"
                value="CASH" 
                checked={payment === "CASH"}
                onChange={() => setPayment("CASH")}
                className="accent-blue-600"
                disabled={isProcessingPayment}
              />
              <span className="text-slate-700 font-medium">Tunai (Cash)</span>
            </label>
            
          </div>

          {/* Extra Note If Cash */}
          {payment === "CASH" && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
              💬 <span className="font-semibold">Catatan:</span> Pembayaran dilakukan saat pesanan tiba.
            </p>
          )}
        </div>

        {/* Pay Button */}
        <button 
          onClick={handlePaymentSubmission}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:bg-blue-400"
          disabled={isProcessingPayment || !orderId || !orderSummary}
        >
          {isProcessingPayment ? "Memproses..." : payment === "CASH" ? "Buat Pesanan" : "Bayar Sekarang"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-2">
          🔒 Pembayaran aman & terenkripsi
        </p>

      </div>
    </div>
  );
}