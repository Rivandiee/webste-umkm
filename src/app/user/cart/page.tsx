"use client";

import { useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([
    { id: 1, name: "Ayam Geprek", price: 20000, qty: 1 },
    { id: 2, name: "Es Teh Manis", price: 5000, qty: 2 },
  ]);

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderNote, setOrderNote] = useState(""); // ⬅ Catatan umum

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-50 py-8 px-6 flex justify-center">
      <div className="w-full max-w-lg space-y-6">

        <h1 className="text-3xl font-extrabold text-slate-800 text-center">
          Keranjang
        </h1>

        {/* Nama, Meja, Catatan Umum */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 space-y-4">
          
          {/* Nama */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Pengunjung
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Budi, Siti, Tamu 3..."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Nomor Meja */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nomor Meja
            </label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Contoh: 1, 12, 20..."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Catatan Umum */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Pesanan
            </label>
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Contoh: Jangan pedas, saus dipisah..."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl shadow-md border border-slate-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-blue-600 font-bold">
                    Rp {item.price.toLocaleString()}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-3">
            Ringkasan Pembayaran
          </h2>

          <div className="flex justify-between text-slate-700">
            <span>Total Items</span>
            <span>{cart.reduce((a, b) => a + b.qty, 0)}</span>
          </div>

          <div className="flex justify-between mt-2 text-slate-700">
            <span>Total Harga</span>
            <span className="font-bold text-blue-600">
              Rp {totalPrice.toLocaleString()}
            </span>
          </div>

          {(customerName || tableNumber || orderNote) && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700">
              <p><strong>Nama:</strong> {customerName || "-"}</p>
              <p><strong>Meja:</strong> {tableNumber || "-"}</p>
              <p><strong>Catatan:</strong> {orderNote || "-"}</p>
            </div>
          )}
        </div>

        <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
          Lanjutkan Checkout
        </button>
        
      </div>
    </div>
  );
}
