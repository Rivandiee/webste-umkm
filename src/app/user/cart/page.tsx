// File: src/app/user/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Placeholder Cart & Table structures
interface CartItem {
    id: string; 
    name: string;
    price: number;
    qty: number;
    note: string; 
}

interface Table {
    id: string;
    number: number;
}

// Data Meja Tiruan (harus diganti dengan fetch dari API /api/tables)
const MOCK_TABLES: Table[] = [
    { id: "tbl1", number: 1 },
    { id: "tbl2", number: 2 },
    { id: "tbl3", number: 3 },
];


export default function CartPage() {
  const router = useRouter();
  
  // --- Cart State Placeholder ---
  const [cart, setCart] = useState<CartItem[]>([
    { id: "m1", name: "Nasi Goreng Special", price: 25000, qty: 1, note: "" },
    { id: "m2", name: "Es Teh Manis", price: 5000, qty: 2, note: "Kurangi gula" },
  ]);
  // ------------------------------
  
  const [customerName, setCustomerName] = useState("");
  const [tableNumberInput, setTableNumberInput] = useState("");
  const [tableId, setTableId] = useState<string | null>(null);
  const [orderNote, setOrderNote] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES); // Fetch from API /api/tables

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const newCart = prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter(item => item.qty > 0);
        
      if (newCart.length === 0) {
          alert("Keranjang kosong. Anda akan diarahkan ke Menu.");
          router.push("/user/menu");
      }
      
      return newCart;
    });
  };
  
  // Validasi dan set Table ID
  useEffect(() => {
      const number = parseInt(tableNumberInput);
      const foundTable = tables.find(t => t.number === number);
      setTableId(foundTable ? foundTable.id : null);
  }, [tableNumberInput, tables]);

  const updateItemNote = (id: string, newNote: string) => {
      setCart(prev => prev.map(i => i.id === id ? { ...i, note: newNote } : i));
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (!customerName.trim()) return setError("Nama pengunjung wajib diisi.");
    if (!tableId) return setError("Nomor meja tidak valid. Silakan masukkan nomor meja yang benar.");
    
    setIsSubmitting(true);
    setError(null);

    const payload = {
        customerName: customerName.trim(),
        tableId: tableId,
        orderNote: orderNote.trim(),
        items: cart.map(item => ({
            menuId: item.id, 
            qty: item.qty,
            note: item.note || null,
        })),
        totalPrice: totalPrice, // Total price bisa dihitung ulang di backend (rekomendasi)
    };
    
    try {
        const response = await fetch("/api/order", { // POST /api/order
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: "Gagal membuat pesanan." }));
            throw new Error(errorData.message || "Gagal membuat pesanan. Silakan coba lagi.");
        }
        
        const result = await response.json();
        // Redirect ke halaman checkout dengan Order ID 
        router.push(`/user/checkout?orderId=${result.orderId}`);
        
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p className="text-gray-500">Keranjang kosong. Mengarahkan ke menu...</p>
          </div>
      );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-50 py-8 px-6 flex justify-center">
      <div className="w-full max-w-lg space-y-6">

        <h1 className="text-3xl font-extrabold text-slate-800 text-center">
          Keranjang
        </h1>
        
        {error && (
            <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-xl">
                Error: {error}
            </div>
        )}

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
              disabled={isSubmitting}
            />
          </div>

          {/* Nomor Meja */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nomor Meja
            </label>
            <input
              type="number"
              value={tableNumberInput}
              onChange={(e) => setTableNumberInput(e.target.value)}
              placeholder="Contoh: 1, 12, 20..."
              className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:outline-none ${
                tableNumberInput && tableId ? 'border-green-400' : (tableNumberInput.length > 0 ? 'border-red-400' : 'border-slate-200')
              }`}
              disabled={isSubmitting}
            />
            {tableNumberInput.length > 0 && !tableId && <p className="text-red-500 text-xs mt-1">Nomor meja tidak ditemukan.</p>}
          </div>

          {/* Catatan Umum */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Pesanan Umum
            </label>
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Contoh: Jangan pedas, saus dipisah..."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              disabled={isSubmitting}
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
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold hover:bg-slate-300"
                    disabled={isSubmitting}
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Catatan per Item */}
              <div className="mt-3">
                <input
                    type="text"
                    value={item.note}
                    onChange={(e) => updateItemNote(item.id, e.target.value)}
                    placeholder="Catatan untuk item ini..."
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    disabled={isSubmitting}
                />
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

          {(customerName || tableNumberInput || orderNote) && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-slate-700">
              <p><strong>Nama:</strong> {customerName || "-"}</p>
              <p><strong>Meja:</strong> {tableNumberInput || "-"} {tableId ? "✅" : "❌"}</p>
              <p><strong>Catatan Umum:</strong> {orderNote || "-"}</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleCheckout}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:bg-blue-400"
          disabled={isSubmitting || cart.length === 0 || !customerName.trim() || !tableId}
        >
          {isSubmitting ? "Memproses Pesanan..." : "Lanjutkan Checkout"}
        </button>
        
      </div>
    </div>
  );
}