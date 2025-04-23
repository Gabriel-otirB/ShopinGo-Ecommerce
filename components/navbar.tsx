import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link
          href={"/"}
          className="font-bold hover:text-blue-600 transition-all duration-300"
        >
          ShopinGo
        </Link>

        <div className="hidden md:flex space-x-6 transition-all duration-300">
          <Link
            href={"/"}
            className="font-medium hover:text-blue-600 transition-all duration-300"
          >
            Home
          </Link>
          <Link
            href={"/products"}
            className="font-medium hover:text-blue-600 transition-all duration-300"
          >
            Products
          </Link>
          <Link
            href={"/checkout"}
            className="font-medium hover:text-blue-600 transition-all duration-300"
          >
            Checkout
          </Link>
        </div>

        <div className="flex items-center space-x-4">

        </div>

      </div>
    </nav>
  )
}

export default Navbar;