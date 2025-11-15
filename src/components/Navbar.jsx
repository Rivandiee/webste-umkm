export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-800">Rumah Makan</h1>

      <a
        href="/user/cart"
        className="text-gray-600 hover:text-gray-900 font-semibold"
      >
        🛒 Keranjang
      </a>
    </nav>
  );
}
