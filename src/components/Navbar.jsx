// File: src/components/Navbar.jsx
export default function Navbar({ cartCount = 0 }) {
  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-800">Rumah Makan</h1>

      <a
        href="/user/cart"
        className="text-gray-600 hover:text-gray-900 font-semibold relative"
      >
        🛒 Keranjang 
        {cartCount > 0 && (
          <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </a>
    </nav>
  );
}