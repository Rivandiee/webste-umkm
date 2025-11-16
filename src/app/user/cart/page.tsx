// File: src/app/user/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface Table {
  id: number;
  number: number;
}

const MOCK_TABLES: Table[] = [
  { id: 1, number: 1 },
  { id: 2, number: 2 },
  { id: 3, number: 3 },
];

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: "Nasi Goreng Special", price: 25000, qty: 1 },
    { id: 2, name: "Es Teh Manis", price: 5000, qty: 2 },
  ]);
  const [customerName, setCustomerName] = useState("");
  const [tableNumberInput, setTableNumberInput] = useState("");
  const [tableId, setTableId] = useState<number | null>(null);
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => {
      const newCart = prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0);

      if (newCart.length === 0) {
        alert("Keranjang kosong. Anda akan diarahkan ke Menu.");
        router.push("/user/menu");
      }

      return newCart;
    });
  };

  useEffect(() => {
    const number = parseInt(tableNumberInput);
    const foundTable = tables.find((t) => t.number === number);
    setTableId(foundTable ? foundTable.id : null);
  }, [tableNumberInput, tables]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (!customerName.trim()) return setError("Nama pengunjung wajib diisi.");
    if (!tableId) return setError("Nomor meja tidak valid. Silakan masukkan nomor meja yang benar.");

    setIsSubmitting(true);
    setError(null);

    const payload = {
      customerName: customerName.trim(),
      tableId,
      orderNote: orderNote.trim(),
      items: cart.map((item) => ({
        menuId: item.id,
        qty: item.qty,
        price: item.price,
      })),
      totalPrice,
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Gagal membuat pesanan." }));
        throw new Error(errorData.message || "Gagal membuat pesanan. Silakan coba lagi.");
      }

      const result = await response.json();
      router.push(`/user/checkout?orderId=${result.orderId}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-blue-50">
        <p className="text-gray-500 text-lg font-medium">Keranjang kosong. Silakan pilih menu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Keranjang Anda</h1>

        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50">
              <div>
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-gray-500">{item.price.toLocaleString()} IDR</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  -
                </button>
                <span className="px-3 py-1 bg-white border rounded-full shadow">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Nama Pengunjung</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Nomor Meja</label>
            <input
              type="number"
              value={tableNumberInput}
              onChange={(e) => setTableNumberInput(e.target.value)}
              placeholder="Masukkan nomor meja"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Catatan Pesanan (opsional)</label>
          <textarea
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder="Tambahkan catatan tambahan..."
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
          />
        </div>

        {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

        <div className="flex justify-between items-center mt-6">
          <p className="font-bold text-xl">Total: <span className="text-blue-600">{totalPrice.toLocaleString()} IDR</span></p>
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
