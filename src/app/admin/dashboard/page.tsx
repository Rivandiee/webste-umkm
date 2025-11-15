export default function DashboardPage() {
  const orders = [
    { id: 1, name: "Budi", item: "Ayam Geprek", status: "baru" },
    { id: 2, name: "Sari", item: "Es Teh", status: "diproses" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Menu</p>
          <h2 className="text-3xl font-bold">24</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pesanan Hari Ini</p>
          <h2 className="text-3xl font-bold">12</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pesanan Baru</p>
          <h2 className="text-3xl font-bold text-red-600">3</h2>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Notifikasi Pesanan</h2>

      <div className="bg-white rounded-xl p-4 shadow">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{o.name}</p>
              <p className="text-sm text-gray-500">{o.item}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                o.status === "baru"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
