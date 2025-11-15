// File: src/app/user/menu/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import MenuCard from "../../../components/MenuCard";
import SectionTitle from "../../../components/SectionTitle";
import Footer from "../../../components/Footer";

// Definisi interface
interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
    id: string;
    name: string;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    note?: string; 
}


export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string; }[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Cart State Placeholder (In-memory for demo) ---
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        alert(`Jumlah ${item.name} diperbarui!`);
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      alert(`${item.name} ditambahkan ke keranjang!`);
      return [...prevCart, { id: item.id, name: item.name, price: item.price, qty: 1, note: "" }];
    });
  };
  
  // Fetch Menu Items and Categories
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch Menu
            const menuRes = await fetch("/api/menu"); // GET /api/menu
            const menuData: MenuItem[] = await menuRes.json();
            setMenuItems(menuData);

            // Fetch Categories for Filter
            const categoryRes = await fetch("/api/category"); // GET /api/category
            const categoryData: Category[] = await categoryRes.json();
            
            const formattedCategories = categoryData.map(cat => ({ 
                id: cat.id, 
                label: cat.name 
            }));
            
            setCategories([{ id: "all", label: "Semua" }, ...formattedCategories]);

        } catch (error) {
            console.error("Gagal mengambil data menu/kategori:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, []);

  // Filter kategori + pencarian
  const filteredMenu = menuItems.filter((item) => {
    // Membandingkan dengan categoryId dari item, bukan field 'category'
    const matchesCategory = filter === "all" || item.categoryId === filter; 
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.qty, 0)} />

      {/* HERO IMAGE (tetap statis) */}
      <div className="w-full h-48 md:h-64 overflow-hidden rounded-b-3xl shadow-md">
        <img
          src="/images/restaurant-banner.jpg"
          className="w-full h-full object-cover"
          alt="Restaurant Banner"
        />
      </div>

      <div className="px-6 py-6">
        <SectionTitle title="Menu Makanan" />

        {/* 🔍 SEARCH BAR */}
        <div className="mt-5">
          <input
            type="text"
            placeholder="Cari makanan / minuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl border shadow-sm
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
          />
        </div>

        {/* 🧭 CATEGORY SLIDER */}
        <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full border text-sm
                transition-all
                ${
                  filter === cat.id
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-400 text-gray-700"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
            <div className="p-6 text-center text-gray-500">Memuat menu...</div>
        ) : filteredMenu.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Menu tidak ditemukan.</div>
        ) : (
            // MENU GRID
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mt-5">
            {filteredMenu.map((item) => (
              <MenuCard key={item.id} item={item} addToCart={addToCart} />
            ))}
            </div>
        )}
      </div>

      <Footer />
    </div>
  );
}