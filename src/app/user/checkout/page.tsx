// File: src/app/user/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Definisi interface untuk Order Summary 
interface OrderSummary {
    id: number; // <-- DIUBAH
    totalPrice: number;
    items: {
// ... (sisa file sama)
        name: string;
        price: number;
        qty: number;
    }[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId"); // Ambil orderId dari query string

  // State for loading, error, and order summary
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  
  // 1. Fetch Order Summary
  useEffect(() => {
// ... (sisa file sama)
  }, [orderId]);
  
  // 2. Submit Payment Method
  const handlePaymentSubmission = async () => {
// ... (sisa file sama)
  }


  if (isLoading) {
// ... (sisa file sama)
  }
  
  if (error || !orderSummary) {
// ... (sisa file sama)
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
        {orderSummary && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Ringkasan Pesanan #{orderSummary.id.toString()}</h2> {/* <-- DIUBAH */}

            <div className="space-y-3">
{/* ... (sisa JSX sama) ... */}
            </div>
          </div>
        )}
{/* ... (sisa JSX sama) ... */}
      </div>
    </div>
  );
}