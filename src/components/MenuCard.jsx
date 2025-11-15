// File: src/components/MenuCard.jsx
export default function MenuCard({ item, addToCart }) {
  return (
    <div className="
      bg-white rounded-xl shadow-md overflow-hidden 
      hover:scale-[1.02] transition cursor-pointer
    ">

      {/* Kotak atas untuk gambar — tinggi fix, proporsional */}
      <div className="w-full h-32 sm:h-40 bg-slate-200">
        <img
          src={item.image || "/images/placeholder-menu.jpg"}
          className="w-full h-full object-cover"
          alt={item.name}
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="text-base font-semibold truncate">{item.name}</h2>

        {/* Deskripsi (item.desc) dihapus karena tidak ada di model Prisma yang baru */}

        <div className="flex justify-between items-center mt-3">
          <p className="font-bold text-green-600 text-sm">
            Rp {item.price.toLocaleString()}
          </p>

          <button 
            className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700"
            onClick={() => addToCart(item)} // Menambahkan item ke keranjang
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}