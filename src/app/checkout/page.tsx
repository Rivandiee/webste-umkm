export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 p-6 flex justify-center">
      {/* Container */}
      <div className="w-full max-w-lg space-y-6">

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-800 text-center tracking-wide">
          Checkout
        </h1>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Ringkasan Pesanan</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Nasi Goreng Special</span>
              <span>Rp 15.000</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Es Teh Manis</span>
              <span>Rp 5.000</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-slate-800 text-lg">
              <span>Total</span>
              <span className="text-blue-600">Rp 20.000</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Metode Pembayaran</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input type="radio" name="pay" defaultChecked className="accent-blue-600" />
              <span className="text-slate-700 font-medium">Dana</span>
            </label>

            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input type="radio" name="pay" className="accent-blue-600" />
              <span className="text-slate-700 font-medium">OVO</span>
            </label>

            <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition">
              <input type="radio" name="pay" className="accent-blue-600" />
              <span className="text-slate-700 font-medium">Transfer Bank</span>
            </label>
          </div>
        </div>

        {/* Pay Button */}
        <button className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
          Bayar Sekarang
        </button>

        {/* Security note */}
        <p className="text-center text-sm text-slate-500 mt-2">
          🔒 Pembayaran aman & terenkripsi
        </p>

      </div>
    </div>
  );
}
