// File: src/app/user/payment/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentDetails {
    orderId: string;
    paymentStatus: string;
    qrCodeUrl: string | null;
    totalAmount: number;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!orderId) {
        setError("Order ID tidak ditemukan.");
        setIsLoading(false);
        return;
    }

    const fetchPaymentDetails = async () => {
        try {
            const res = await fetch(`/api/order/${orderId}/payment-details`); // GET /api/order/ORDER_ID/payment-details
            if (!res.ok) {
                throw new Error("Gagal mengambil detail pembayaran.");
            }
            const data = await res.json();
            setPaymentDetails(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchPaymentDetails();
  }, [orderId]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat Detail Pembayaran...</div>;
  }
  
  if (error || !paymentDetails) {
    return (
        <div className="min-h-screen p-6 text-center">
            <h1 className="text-xl font-bold text-red-600">Error Pembayaran</h1>
            <p className="text-red-500 mt-2">{error || "Data pembayaran tidak dapat dimuat."}</p>
        </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center">
      <h1 className="text-2xl font-bold text-slate-800">Pembayaran Order #{paymentDetails.orderId.substring(0, 8)}</h1>
      <p className="text-xl font-semibold text-blue-600 mt-2">Total: Rp {paymentDetails.totalAmount.toLocaleString()}</p>

      <div className="bg-white p-6 mt-6 rounded-xl shadow">
        <p className="text-slate-700">Scan QRIS di bawah untuk melakukan pembayaran</p>

        <div className="mt-4 flex justify-center">
          {paymentDetails.qrCodeUrl ? (
            <img 
              src={paymentDetails.qrCodeUrl} 
              alt="QR Code Pembayaran"
              className="w-40 h-40 object-contain"
            />
          ) : (
            <div className="w-40 h-40 bg-red-100 rounded-lg flex items-center justify-center">
                <p className="text-red-600 text-sm">QR Code tidak tersedia</p>
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-gray-500">Status Pembayaran: {paymentDetails.paymentStatus}</p>
      </div>
      
      <div className="mt-6">
          <a 
              href={`/user/status?orderId=${paymentDetails.orderId}`}
              className="text-blue-600 font-semibold underline"
          >
              Cek Status Pesanan
          </a>
      </div>
    </div>
  );
}