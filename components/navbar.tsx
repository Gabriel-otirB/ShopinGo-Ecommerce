"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import ThemeToggle from "./toogle-theme"

const Navbar = () => {
  const pathname = usePathname()

  const getLinkClass = (href: string) => `
  text-lg font-medium transition-colors duration-300 pb-1 border-b-2
  ${pathname === href
      ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
      : "text-gray-800 dark:text-white border-transparent hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400"
    }
`


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
          <Link href="/" className={getLinkClass("/")}>Home</Link>
          <Link href="/products" className={getLinkClass("/products")}>Products</Link>
          <Link href="/checkout" className={getLinkClass("/checkout")}>Checkout</Link>
        </div>

        {/* Mobile Menu + ThemeToggle */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
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
                  <Link href="/" className={getLinkClass("/")}>Home</Link>
                  <Link href="/products" className={getLinkClass("/products")}>Products</Link>
                  <Link href="/checkout" className={getLinkClass("/checkout")}>Checkout</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Theme Toggle sempre visível */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
