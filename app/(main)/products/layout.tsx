"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories } from "@/lib/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollTop from '@/components/scroll-top';

export default function ProductsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isProductPage = pathname?.startsWith("/products/") && !pathname.includes("/category/");

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);

      if (mobile) setItemsPerPage(categories.length);
      else if (width >= 1280) setItemsPerPage(12);
      else if (width >= 1024) setItemsPerPage(6);
      else setItemsPerPage(5);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = isMobile
    ? categories
    : categories.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <>
      <ScrollTop />
      <div className="max-w-screen-xl mx-auto px-4 -mt-4">


        {/* If is not a product page render tabs */}
        {!isProductPage && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-center">Produtos</h1>
            <Tabs
              defaultValue="todos"
              className="mb-6 w-full bg-neutral-100 dark:bg-neutral-900 rounded"
            >
              <div className={`flex items-center gap-2 ${isMobile ? "overflow-x-auto" : "overflow-hidden"}`}>
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="p-2 flex-shrink-0 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 duration-300 cursor-pointer"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className={`${isMobile ? "overflow-x-auto scrollbar-hide" : "flex-1"} w-full`}>
                  <TabsList className="flex items-center gap-2 px-2 py-2 bg-neutral-100 dark:bg-neutral-900 rounded">
                    <TabsTrigger value="todos" asChild className="min-w-max">
                      <Link href="/products">
                        <span className="flex items-center gap-2 text-sm">Todos</span>
                      </Link>
                    </TabsTrigger>

                    {paginatedCategories.map((category) => (
                      <TabsTrigger key={category.slug} value={category.slug} asChild className="min-w-max">
                        <Link href={`/products/category/${category.slug}`}>
                          <span className="flex items-center gap-2 text-sm">
                            {category.icon}
                            {category.name}
                          </span>
                        </Link>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 flex-shrink-0 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 duration-300 disabled:opacity-30 cursor-pointer"
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </Tabs>
          </>
        )}

        {children}
      </div>
    </>
  );
}
