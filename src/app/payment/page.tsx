export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-screen-md mx-auto text-center">
      <h1 className="text-2xl font-bold text-slate-800">Pembayaran</h1>

      <div className="bg-white p-6 mt-6 rounded-xl shadow">
        <p className="text-slate-700">Scan QR untuk melakukan pembayaran</p>

        <div className="mt-4 flex justify-center">
          <div className="w-40 h-40 bg-slate-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
