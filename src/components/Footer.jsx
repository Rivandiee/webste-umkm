export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-green-600">Rumah Makan Kita</h3>
            <p className="mt-2 text-sm">
              Nikmati hidangan terbaik dengan cita rasa rumahan.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold mb-2">Kontak</h4>
            <p className="text-sm">📍 Jl. Merdeka No. 12</p>
            <p className="text-sm">📞 0821-1234-5678</p>
            <p className="text-sm">✉️ email@rmkita.com</p>
          </div>

          {/* Jam Operasional */}
          <div>
            <h4 className="font-semibold mb-2">Jam Operasional</h4>
            <p className="text-sm">Senin - Jumat: 08.00 - 21.00</p>
            <p className="text-sm">Sabtu - Minggu: 09.00 - 22.00</p>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t">
          © {new Date().getFullYear()} Rumah Makan Kita. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
