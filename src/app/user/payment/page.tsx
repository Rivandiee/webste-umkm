// File: src/app/user/payment/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentDetails {
    orderId: number; // <-- DIUBAH
    paymentStatus: string;
    qrCodeUrl: string | null;
    totalAmount: number;
}
// ... (sisa file sama)
export default function PaymentPage() {
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  // Example: Fetch payment details and handle error (add your actual fetching logic here)
  useEffect(() => {
    // Replace with your actual fetching logic
    // Example:
    // fetchPaymentDetails()
    //   .then(details => setPaymentDetails(details))
    //   .catch(err => setError("Failed to fetch payment details"));
  }, []);
  
  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-600">Terjadi kesalahan</h1>
        <p className="text-xl mt-2">{error || "Memuat data pembayaran..."}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center">
      <h1 className="text-2xl font-bold text-slate-800">Pembayaran Order #{paymentDetails.orderId.toString()}</h1> {/* <-- DIUBAH */}
      <p className="text-xl font-semibold text-blue-600 mt-2">Total: Rp {paymentDetails.totalAmount.toLocaleString()}</p>

      <div className="bg-white p-6 mt-6 rounded-xl shadow">
{/* ... (sisa JSX sama) ... */}
      </div>
    </div>
  );
}