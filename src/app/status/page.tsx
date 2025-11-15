export default function StatusPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center">
      <h1 className="text-2xl font-bold text-slate-800">Status Pesanan</h1>

      <div className="bg-white p-6 mt-6 rounded-xl shadow">
        <h2 className="text-blue-600 font-bold text-xl">Pesanan Diproses</h2>
        <p className="text-slate-600 mt-2">
          Mohon tunggu, pesanan Anda sedang disiapkan.
        </p>
      </div>
    </div>
  );
}
