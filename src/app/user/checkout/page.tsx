"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("dana");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 p-6 flex justify-center">
      <div className="w-full max-w-lg space-y-6">

        <h1 className="text-3xl font-extrabold text-slate-800 text-center tracking-wide">
          Checkout
        </h1>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Ringkasan Pesanan</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Nasi Goreng Special</span>
              <span>Rp 15.000</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Es Teh Manis</span>
              <span>Rp 5.000</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-slate-800 text-lg">
              <span>Total</span>
              <span className="text-blue-600">Rp 20.000</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Metode Pembayaran</h2>

          <div className="space-y-3">
            {/* Dana */}
            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="radio"
                name="pay"
                value="dana"
                checked={payment === "dana"}
                onChange={(e) => setPayment(e.target.value)}
                className="accent-blue-600"
              />
              <span className="text-slate-700 font-medium">Dana</span>
            </label>

            {/* OVO */}
            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="radio"
                name="pay"
                value="ovo"
                checked={payment === "ovo"}
                onChange={(e) => setPayment(e.target.value)}
                className="accent-blue-600"
              />
              <span className="text-slate-700 font-medium">OVO</span>
            </label>

            {/* Transfer Bank */}
            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="radio"
                name="pay"
                value="transfer"
                checked={payment === "transfer"}
                onChange={(e) => setPayment(e.target.value)}
                className="accent-blue-600"
              />
              <span className="text-slate-700 font-medium">Transfer Bank</span>
            </label>

            {/* Tunai / Cash */}
            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input
                type="radio"
                name="pay"
                value="cash"
                checked={payment === "cash"}
                onChange={(e) => setPayment(e.target.value)}
                className="accent-blue-600"
              />
              <span className="text-slate-700 font-medium">Tunai (Cash)</span>
            </label>
          </div>

          {/* Extra Note If Cash */}
          {payment === "cash" && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
              💬 <span className="font-semibold">Catatan:</span> Pembayaran dilakukan saat pesanan tiba.
            </p>
          )}
        </div>

        {/* Pay Button */}
        <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
          {payment === "cash" ? "Buat Pesanan" : "Bayar Sekarang"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-2">
          🔒 Pembayaran aman & terenkripsi
        </p>

      </div>
    </div>
  );
}
