'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, PanelTop, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ThemeToggle from "./toogle-theme";
import { useCartStore } from "@/store/cart-store";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { formatCurrency } from '@/lib/helper';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const Navbar = () => {
  const { items } = useCartStore();
  const carCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const pathname = usePathname();
  const [openNavbar, setOpenNavbar] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const getLinkClass = (href: string) => {
    const isActive =
      pathname === href ||
      (href === "/products" && pathname.startsWith("/products"));
    return `
      text-lg font-medium transition-colors duration-300 pb-1 border-b-2
      ${isActive
        ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
        : "text-gray-800 dark:text-white border-transparent hover:text-blue-600 dark:hover:text-blue-400"
      }
    `;
  };

  return (
    <nav className="sticky top-0 z-50 bg-neutral-100 dark:bg-neutral-950 shadow-md shadow-gray-300 dark:shadow-black/30">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">

        <div className='flex items-center gap-2'>
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet open={openNavbar} onOpenChange={setOpenNavbar}>
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
                  <Link href="/" className={getLinkClass("/")} onClick={() => setOpenNavbar(false)}>Início</Link>
                  <Link href="/products" className={getLinkClass("/products")} onClick={() => setOpenNavbar(false)}>Produtos</Link>
                  <Link href="/checkout" className={getLinkClass("/checkout")} onClick={() => setOpenNavbar(false)}>Carrinho</Link>
                  <Link href="/account" className={getLinkClass("/account")} onClick={() => setOpenNavbar(false)}>Minha Conta</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors duration-300"
          >
            ShopinGo
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className={getLinkClass("/")}>Início</Link>
          <Link href="/products" className={getLinkClass("/products")}>Produtos</Link>
          <Link href="/checkout" className={getLinkClass("/checkout")}>Carrinho</Link>
        </div>

        {/* Mobile Menu + ThemeToggle + Cart */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <div className="order-3">
            <ThemeToggle />
          </div>

          {/* Cart HoverCard for Desktop */}
          <div className="relative order-2 hidden md:block">
            <HoverCard openDelay={50} closeDelay={50} open={openPreview} onOpenChange={setOpenPreview}>
              <HoverCardTrigger asChild>
                <Link href="/checkout" aria-label="Carrinho" className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-800 dark:text-white" />
                  {carCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      {carCount}
                    </span>
                  )}
                </Link>
              </HoverCardTrigger>

              <HoverCardContent className="w-80 bg-white dark:bg-neutral-900 border dark:border-neutral-800 shadow-lg rounded p-4">
                {items.length > 0 ? (
                  <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center space-x-2"
                      >
                        <Link
                          href={`/products/${item.id}`}
                          className="flex items-center gap-2 w-full"
                          onClick={() => setOpenPreview(false)}
                        >
                          <Image
                            src={item.imageUrl || ""}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded object-contain w-[50px] h-[50px]"
                            draggable={false}
                          />
                          <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="font-medium text-sm line-clamp-3 break-words">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-700 dark:text-gray-400">
                              Quantidade: {item.quantity}
                            </span>
                          </div>
                        </Link>
                        <span className="font-semibold text-sm whitespace-nowrap">
                          {formatCurrency((item.price * item.quantity) / 100)}
                        </span>
                      </div>
                    ))}

                    <Link
                      href="/checkout"
                      className="mt-2 w-full text-center text-sm font-medium bg-black text-white rounded-3xl py-2"
                      onClick={() => setOpenPreview(false)}
                    >
                      Ver Meu Carrinho De Compras
                    </Link>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    Não há produtos ainda.
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Cart Link for Mobile */}
          <div className="relative order-2 md:hidden">
            <Link href="/checkout" aria-label="Carrinho" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-800 dark:text-white" />
              {carCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                  {carCount}
                </span>
              )}
            </Link>
          </div>

          {/* Account Desktop */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden md:flex relative order-2">
                  <Link href="/account" aria-label="Minha Conta" className="relative">
                    <UserIcon className="h-6 w-6 text-gray-800 dark:text-white" />
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={6}
                className="bg-white dark:bg-neutral-900 text-gray-800 dark:text-white border py-3 font-medium"
              >
                Minha Conta
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Account Mobile */}
          <div className="flex md:hidden relative order-2">
            <Link href="/account" aria-label="Minha Conta" className="relative">
              <UserIcon className="h-6 w-6 text-gray-800 dark:text-white" />
            </Link>
          </div>

          {/* Admin Panel Desktop */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden md:flex relative order-2">
                  <Link href="/admin" aria-label="Minha Conta" className="relative">
                    <PanelTop className="h-6 w-6 text-gray-800 dark:text-white" />
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={6}
                className="bg-white dark:bg-neutral-900 text-gray-800 dark:text-white border py-3 font-medium"
              >
                Painel Admin
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Admin Panel Mobile */}
          <div className="flex md:hidden relative order-2">
            <Link href="/admin" aria-label="Minha Conta" className="relative">
              <PanelTop className="h-6 w-6 text-gray-800 dark:text-white" />
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
