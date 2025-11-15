export default function MenuCard({ item }) {
  return (
    <div className="
      bg-white rounded-xl shadow-md overflow-hidden 
      hover:scale-[1.02] transition cursor-pointer
    ">

      {/* Kotak atas untuk gambar — tinggi fix, proporsional */}
      <div className="w-full h-32 sm:h-40 bg-slate-200">
        <img
          src={item.img}
          className="w-full h-full object-cover"
          alt={item.name}
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="text-base font-semibold truncate">{item.name}</h2>

        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {item.desc}
        </p>

        <div className="flex justify-between items-center mt-3">
          <p className="font-bold text-green-600 text-sm">
            Rp {item.price.toLocaleString()}
          </p>

          <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700">
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
