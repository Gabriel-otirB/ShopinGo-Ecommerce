// components/Navbar.tsx
"use client"

import Link from "next/link";
import ThemeToggle from './toogle-theme';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-neutral-100 dark:bg-neutral-950 shadow-md shadow-gray-300 dark:shadow-black/30">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors duration-300"
        >
          ShopinGo
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-lg font-medium text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors duration-300">
            Home
          </Link>
          <Link href="/products" className="text-lg font-medium text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors duration-300">
            Products
          </Link>
          <Link href="/checkout" className="text-lg font-medium text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors duration-300">
            Checkout
          </Link>
        </div>

        {/* Theme */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
