'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { categories } from '@/lib/data'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const currentCategory = pathname?.split("/")[2] || "todos"

  const [page, setPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  useEffect(() => {
    function updateItemsPerPage() {
      const width = window.innerWidth
      if (width >= 1280) setItemsPerPage(8)
      else if (width >= 1024) setItemsPerPage(6)
      else if (width >= 768) setItemsPerPage(5)
      else setItemsPerPage(2)
    }

    updateItemsPerPage()
    window.addEventListener("resize", updateItemsPerPage)
    return () => window.removeEventListener("resize", updateItemsPerPage)
  }, [])

  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const paginatedCategories = categories.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  )

  return (
    <div className="max-w-6xl mx-auto px-4 -mt-4 pb-6">
      <h1 className='text-3xl font-bold mb-4 text-center'>Produtos</h1>
      <Tabs
        defaultValue={currentCategory}
        className="mb-6 w-full bg-neutral-100 dark:bg-neutral-900 rounded"
      >
        <div className="flex items-center justify-between gap-2">
          {/* Back Button */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 duration-300 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Tabs List */}
          <TabsList className="flex flex-1 flex-nowrap items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded px-2 py-2">
            <TabsTrigger value="todos" asChild className="min-w-max">
              <Link href="/products">
                <span className="flex items-center gap-2 text-sm">Todos</span>
              </Link>
            </TabsTrigger>

            {paginatedCategories.map((category) => (
              <TabsTrigger
                key={category.slug}
                value={category.slug}
                asChild
                className="min-w-max"
              >
                <Link href={`/products/${category.slug}`}>
                  <span className="flex items-center gap-2 text-sm">
                    {category.icon}
                    {category.name}
                  </span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Next Button */}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 duration-300 disabled:opacity-30 cursor-pointer"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </Tabs>

      {children}
    </div>
  )
}
