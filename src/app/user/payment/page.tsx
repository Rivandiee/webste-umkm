// File: src/app/user/payment/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentDetails {
  orderId: number;
  paymentStatus: string;
  qrCodeUrl: string | null;
  totalAmount: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderIdQuery = searchParams.get("orderId");

  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopying, setIsCopying] = useState<boolean>(false);

  // --- Fetch payment details ---
  useEffect(() => {
    if (!orderIdQuery) {
      setError("Order ID tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    const fetchPayment = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API fetch
        // Simulasi fetch dengan timeout
        await new Promise((res) => setTimeout(res, 1000));

        setPaymentDetails({
          orderId: parseInt(orderIdQuery),
          paymentStatus: "pending",
          qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=order" + orderIdQuery,
          totalAmount: 75000,
        });
      } catch (e: any) {
        setError("Gagal memuat data pembayaran.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [orderIdQuery]);

  // --- Copy Order ID ---
  const handleCopyOrderId = async () => {
    if (!paymentDetails) return;
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(paymentDetails.orderId.toString());
      alert("Order ID berhasil disalin!");
    } catch {
      alert("Gagal menyalin Order ID");
    } finally {
      setIsCopying(false);
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-500 text-lg font-medium animate-pulse">Memuat detail pembayaran...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">Terjadi kesalahan</h1>
        <p className="text-xl mt-2">{error || "Memuat data pembayaran..."}</p>
      </div>
    );
  }

  // --- Main JSX ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center flex flex-col items-center">
      <h1 className="text-2xl font-bold text-slate-800">Pembayaran Order #{paymentDetails.orderId}</h1>
      <p className="text-xl font-semibold text-blue-600 mt-2">Total: Rp {paymentDetails.totalAmount.toLocaleString()}</p>

      <div className="bg-white p-6 mt-6 rounded-2xl shadow-lg w-full space-y-6">
        {/* QR Code */}
        {paymentDetails.qrCodeUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={paymentDetails.qrCodeUrl}
              alt="QR Code Pembayaran"
              className="w-40 h-40 object-contain"
            />
            <p className="mt-2 text-gray-500 text-sm">Scan QR untuk melakukan pembayaran</p>
          </div>
        ) : (
          <p className="text-gray-400">QR Code tidak tersedia</p>
        )}

        {/* Payment Status */}
        <div className="text-center">
          <span
            className={`px-3 py-1 rounded-full font-semibold ${
              paymentDetails.paymentStatus === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {paymentDetails.paymentStatus === "paid" ? "Sudah Dibayar" : "Belum Dibayar"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleCopyOrderId}
            disabled={isCopying}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isCopying ? "Menyalin..." : "Salin Order ID"}
          </button>

          <button
            onClick={() => alert("Pembayaran berhasil (simulasi)!")}
            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
