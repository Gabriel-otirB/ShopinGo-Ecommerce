'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import ThemeToggle from "./toogle-theme"
import { useCartStore } from '@/store/cart-store'

const Navbar = () => {
  const { items } = useCartStore();
  const carCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const pathname = usePathname();

  // Function to check if the current path is part of the given href
  const getLinkClass = (href: string) => {
    // Check if the current path matches or starts with the href (only for the /products path)
    const isActive = pathname === href || (href === "/products" && pathname.startsWith("/products"));
    return `
      text-lg font-medium transition-colors duration-300 pb-1 border-b-2
      ${isActive
        ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
        : "text-gray-800 dark:text-white border-transparent hover:text-blue-600 dark:hover:text-blue-400"
      }
    `;
  }

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

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className={getLinkClass("/")}>Início</Link>
          <Link href="/products" className={getLinkClass("/products")}>Produtos</Link>
          <Link href="/checkout" className={getLinkClass("/checkout")}>Carrinho</Link>
        </div>

        {/* Mobile Menu + ThemeToggle + Cart */}
        <div className="flex items-center space-x-4 md:space-x-6">
          
          {/* ThemeToggle (order 1 on mobile) */}
          <div className="order-1 md:order-2">
            <ThemeToggle />
          </div>

          <div className="relative order-2 md:order-1">
            <Link href="/checkout" aria-label="Carrinho" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-800 dark:text-white" />
              {carCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {carCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden order-3 md:order-none">
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Abrir menu de navegação">
                  <Menu className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-neutral-100 dark:bg-neutral-950">
                <VisuallyHidden>
                  <DialogTitle>Menu de navegação</DialogTitle>
                </VisuallyHidden>
                <nav className="mt-8 flex flex-col space-y-4 mx-auto text-center">
                  <Link href="/" className={getLinkClass("/")}>Início</Link>
                  <Link href="/products" className={getLinkClass("/products")}>Produtos</Link>
                  <Link href="/checkout" className={getLinkClass("/checkout")}>Carrinho</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
