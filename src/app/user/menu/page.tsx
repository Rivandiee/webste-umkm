"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";
import MenuCard from "../../../components/MenuCard";
import SectionTitle from "../../../components/SectionTitle";
import Footer from "../../../components/Footer";


const menu = [
  // MAKANAN
  {
    id: 1,
    name: "Nasi Goreng Special",
    price: 25000,
    category: "makanan",
    image: "https://i.ibb.co/8dJ6Rt2/nasi-goreng.jpg"
  },
  {
    id: 2,
    name: "Ayam Geprek Crispy",
    price: 22000,
    category: "makanan",
    image: "https://i.ibb.co/3cGkF6x/geprek.jpg"
  },
  {
    id: 3,
    name: "Soto Ayam Lamongan",
    price: 27000,
    category: "makanan",
    image: "https://i.ibb.co/n8yKy5d/soto.jpg"
  },
  {
    id: 4,
    name: "Bakso Urat Jumbo",
    price: 28000,
    category: "makanan",
    image: "https://i.ibb.co/mJ7t6G0/bakso.jpg"
  },
  {
    id: 5,
    name: "Mie Ayam Bakso Komplit",
    price: 23000,
    category: "makanan",
    image: "https://i.ibb.co/f49sJcw/mie-ayam.jpg"
  },
  {
    id: 6,
    name: "Burger Beef Premium",
    price: 32000,
    category: "makanan",
    image: "https://i.ibb.co/Z1GJh3k/burger.jpg"
  },
  {
    id: 7,
    name: "Pizza Mini Cheese",
    price: 28000,
    category: "makanan",
    image: "https://i.ibb.co/SNy8nZf/pizza.jpg"
  },

  // MINUMAN
  {
    id: 8,
    name: "Es Teh Manis",
    price: 5000,
    category: "minuman",
    image: "https://i.ibb.co/3d7K2qz/esteh.jpg"
  },
  {
    id: 9,
    name: "Lemon Tea",
    price: 8000,
    category: "minuman",
    image: "https://i.ibb.co/QvLKyVv/lemontea.jpg"
  },
  {
    id: 10,
    name: "Jus Alpukat",
    price: 15000,
    category: "minuman",
    image: "https://i.ibb.co/qjKkS2s/jus-alpukat.jpg"
  },
  {
    id: 11,
    name: "Jus Mangga",
    price: 13000,
    category: "minuman",
    image: "https://i.ibb.co/TbX8XhZ/jus-mangga.jpg"
  },
  {
    id: 12,
    name: "Kopi Susu Gula Aren",
    price: 18000,
    category: "minuman",
    image: "https://i.ibb.co/YCFqY3r/kopi-gula-aren.jpg"
  },
  {
    id: 13,
    name: "Matcha Latte",
    price: 19000,
    category: "minuman",
    image: "https://i.ibb.co/T0Jg9nG/matcha.jpg"
  },
  {
    id: 14,
    name: "Milkshake Coklat",
    price: 16000,
    category: "minuman",
    image: "https://i.ibb.co/J3Z9Q8M/milkshake.jpg"
  },

  // DESSERT
  {
    id: 15,
    name: "Pancake Strawberry",
    price: 20000,
    category: "dessert",
    image: "https://i.ibb.co/2WkhJdR/pancake.jpg"
  },
  {
    id: 16,
    name: "Brownies Coklat Lumer",
    price: 18000,
    category: "dessert",
    image: "https://i.ibb.co/YQmMj4C/brownies.jpg"
  },
  {
    id: 17,
    name: "Ice Cream Vanilla",
    price: 10000,
    category: "dessert",
    image: "https://i.ibb.co/CJS70xB/icecream.jpg"
  },
  {
    id: 18,
    name: "Manggo Sticky Rice",
    price: 22000,
    category: "dessert",
    image: "https://i.ibb.co/KWsVm7Q/mango-sticky-rice.jpg"
  },

  // SNACK
  {
    id: 19,
    name: "Kentang Goreng",
    price: 10000,
    category: "snack",
    image: "https://i.ibb.co/R6zw29J/kentang.jpg"
  },
  {
    id: 20,
    name: "Sosis Bakar",
    price: 12000,
    category: "snack",
    image: "https://i.ibb.co/7VSStNv/sosis.jpg"
  },
  {
    id: 21,
    name: "Tahu Crispy",
    price: 8000,
    category: "snack",
    image: "https://i.ibb.co/FBY0w5G/tahu-crispy.jpg"
  },
  {
    id: 22,
    name: "Dimsum Ayam",
    price: 15000,
    category: "snack",
    image: "https://i.ibb.co/kXvBymG/dimsum.jpg"
  },
  {
    id: 23,
    name: "Onion Rings",
    price: 12000,
    category: "snack",
    image: "https://i.ibb.co/nQHh0Cs/onion-rings.jpg"
  },

  // EXTRA
  {
    id: 24,
    name: "Ayam Bakar Madu",
    price: 30000,
    category: "makanan",
    image: "https://i.ibb.co/Mk5jzDw/ayam-bakar.jpg"
  },
  {
    id: 25,
    name: "Ramen Pedas Level 3",
    price: 27000,
    category: "makanan",
    image: "https://i.ibb.co/5hQzBgj/ramen.jpg"
  },
  {
    id: 26,
    name: "Kopi Hitam Tubruk",
    price: 10000,
    category: "minuman",
    image: "https://i.ibb.co/znF2nKT/kopi-hitam.jpg"
  },
  {
    id: 27,
    name: "Pudding Caramel",
    price: 12000,
    category: "dessert",
    image: "https://i.ibb.co/0KjDdyT/pudding.jpg"
  },
  {
    id: 28,
    name: "Churros Mini",
    price: 15000,
    category: "snack",
    image: "https://i.ibb.co/sH3yZJx/churros.jpg"
  },
  {
    id: 29,
    name: "Cappuccino Panas",
    price: 15000,
    category: "minuman",
    image: "https://i.ibb.co/9Wy2pKL/capuccino.jpg"
  },
  {
    id: 30,
    name: "Nasi Ayam Teriyaki",
    price: 28000,
    category: "makanan",
    image: "https://i.ibb.co/DMfqdbW/teriyaki.jpg"
  }
];


const categories = [
  { id: "all", label: "Semua" },
  { id: "makanan", label: "Makanan" },
  { id: "minuman", label: "Minuman" },
  { id: "snack", label: "Snack" },
  { id: "manis", label: "Manis" },
  { id: "pedas", label: "Pedas" },
];

export default function MenuPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Filter kategori + pencarian
  const filteredMenu = menu.filter((item) => {
    const matchesCategory = filter === "all" || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      {/* HERO IMAGE */}
      <div className="w-full h-48 md:h-64 overflow-hidden rounded-b-3xl shadow-md">
        <img
          src="/images/restaurant-banner.jpg"
          className="w-full h-full object-cover"
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

        {/* 🧭 CATEGORY SLIDER (HORIZONTAL SCROLL) */}
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

        {/* MENU GRID */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredMenu.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
      </div>

      <Footer />

    </div>
  );
}
