"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import { Stripe } from "stripe";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  products: (Stripe.Product & { default_price?: Stripe.Price })[];
}

const ITEMS_PER_PAGE = 12;

export const ProductList = ({ products }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getPrice = (product: Stripe.Product & { default_price?: Stripe.Price }) => {
    return (product.default_price?.unit_amount ?? 0) / 100;
  };

  const prices = useMemo(() => products.map(getPrice), [products]);

  const minPrice = useMemo(() => Math.min(...prices), [prices]);
  const maxPrice = useMemo(() => Math.max(...prices), [prices]);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(term);
    const descriptionMatch = product.description
      ? product.description.toLowerCase().includes(term)
      : false;
    const price = getPrice(product);
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    return (nameMatch || descriptionMatch) && priceMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex gap-6 flex-col md:flex-row">
      <div className="flex-1 relative">
        <div className="mb-4 flex justify-center -mt-2 md:mt-0">
          <input
            type="text"
            aria-label="Buscar produtos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Procurar produtos..."
            className="
            w-full max-w-md rounded border-2 border-gray-300 dark:border-neutral-500 px-4 py-1
            focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-all duration-300"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer -mb-2 md:mb-0 md:absolute md:top-0 border-2 border-gray-300 dark:border-neutral-500">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 md:w-100 p-6">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>

            <h2 className="text-lg font-semibold mt-4 mb-4">Filtrar por preço</h2>
            <Slider
              min={minPrice}
              max={maxPrice}
              step={1}
              value={priceRange}
              onValueChange={(val) => setPriceRange([val[0], val[1]])}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-sm mt-2 text-muted-foreground">
              <span>R$ {priceRange[0].toFixed(2)}</span>
              <span>R$ {priceRange[1].toFixed(2)}</span>
            </div>
          </SheetContent>
        </Sheet>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-neutral-500">
            Nenhum produto encontrado.
          </p>
        ) : (
          <>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1}
                      className={`cursor-pointer rounded px-3 py-1 transition ${currentPage === 1
                          ? "bg-neutral-200/50 dark:bg-neutral-950/50 text-black/50 dark:text-white/50 pointer-events-none"
                          : "bg-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 hover:dark:bg-neutral-900"
                        }`}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== index + 1) handlePageChange(index + 1);
                        }}
                        isActive={currentPage === index + 1}
                        className={`transition rounded px-3 py-1 ${currentPage === index + 1
                            ? "pointer-events-none bg-neutral-200/50 dark:bg-neutral-950/50 text-black/50 dark:text-white/50"
                            : "bg-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 hover:dark:bg-neutral-900"
                          }`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={`cursor-pointer rounded px-3 py-1 transition ${currentPage === totalPages
                          ? "bg-neutral-200/50 dark:bg-neutral-950/50 text-black/50 dark:text-white/50 pointer-events-none"
                          : "bg-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 hover:dark:bg-neutral-900"
                        }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
