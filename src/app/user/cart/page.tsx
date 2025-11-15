// File: src/app/user/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Placeholder Cart & Table structures
interface CartItem {
    id: number; // <-- DIUBAH
    name: string;
    price: number;
    qty: number;
    note: string; 
}

interface Table {
    id: number; // <-- DIUBAH
    number: number;
}

// Data Meja Tiruan (harus diganti dengan fetch dari API /api/tables)
const MOCK_TABLES: Table[] = [
    { id: 1, number: 1 }, // <-- DIUBAH
    { id: 2, number: 2 }, // <-- DIUBAH
    { id: 3, number: 3 }, // <-- DIUBAH
];


export default function CartPage() {
  const router = useRouter();
  
  // --- Cart State Placeholder ---
  // ID di sini harus number, sesuai dengan ID menu Anda
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: "Nasi Goreng Special", price: 25000, qty: 1, note: "" }, // <-- DIUBAH (contoh ID)
    { id: 2, name: "Es Teh Manis", price: 5000, qty: 2, note: "Kurangi gula" }, // <-- DIUBAH (contoh ID)
  ]);
  // ------------------------------
  
  const [customerName, setCustomerName] = useState("");
  const [tableNumberInput, setTableNumberInput] = useState("");
  const [tableId, setTableId] = useState<number | null>(null); // <-- DIUBAH
  const [orderNote, setOrderNote] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES); // Fetch from API /api/tables

  const updateQty = (id: number, delta: number) => { // <-- DIUBAH
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

  const updateItemNote = (id: number, newNote: string) => { // <-- DIUBAH
      setCart(prev => prev.map(i => i.id === id ? { ...i, note: newNote } : i));
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    // ... (validasi sama)
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (!customerName.trim()) return setError("Nama pengunjung wajib diisi.");
    if (!tableId) return setError("Nomor meja tidak valid. Silakan masukkan nomor meja yang benar.");
    
    setIsSubmitting(true);
    setError(null);

    const payload = {
        customerName: customerName.trim(),
        tableId: tableId, // tableId sudah number dari state
        orderNote: orderNote.trim(),
        items: cart.map(item => ({
            menuId: item.id, // item.id sudah number dari state
            qty: item.qty,
            note: item.note || null,
            price: item.price // DITAMBAH: Kirim harga item
        })),
        totalPrice: totalPrice, 
    };
    
    try {
        const response = await fetch("/api/order", { // POST /api/order
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
// ... (sisa file sama)
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
      // ... (sisa file sama)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-blue-50 py-8 px-6 flex justify-center">
      {/* ... (sisa JSX sama) ... */}
    </div>
  );
}