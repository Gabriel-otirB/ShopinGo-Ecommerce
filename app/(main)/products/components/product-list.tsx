"use client";

import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductCard from './product-card'; 
import { Stripe } from "stripe";

interface Props {
  products: Stripe.Product[];
}

const ITEMS_PER_PAGE = 12;

export const ProductList = ({ products }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(term);
    const descriptionMatch = product.description
      ? product.description.toLowerCase().includes(term)
      : false;

    return nameMatch || descriptionMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          aria-label="Buscar produtos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Procurar produtos..."
          className="w-full max-w-md rounded border-2 border-gray-300 px-4 py-1 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-all duration-300"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-neutral-500">Nenhum produto encontrado.</p>
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
                      className={` transitionrounded px-3 py-1 transition ${ currentPage === index + 1
                        ? "pointer-events-none bg-neutral-200/50 dark:bg-neutral-950/50 text-black/50 dark:text-white/50"
                        : "bg-neutral-300 hover:bg-neutral-200 dark:bg-neutral-950 hover:dark:bg-neutral-900"
                        }
                        `}>
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
  );
};
