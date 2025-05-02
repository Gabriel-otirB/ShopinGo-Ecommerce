'use client'

import { useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Stripe from 'stripe'
import Image from "next/image"
import Link from 'next/link'

interface Props {
  recommendedProducts: Stripe.Product[]
}

export const Recommendations = ({ recommendedProducts }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const newScroll =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth

      scrollRef.current.scrollTo({ left: newScroll, behavior: "smooth" })
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-black dark:text-white px-4 pt-4 pb-2">
        Recomendações
      </h1>

      <div className="relative group px-4">
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
          bg-neutral-100 dark:bg-neutral-900 border rounded-full p-2 shadow cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="
          flex space-x-4 overflow-x-auto
          md:overflow-x-hidden scroll-smooth no-scrollbar py-4 px-4 md:px-6
          bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500  rounded
          "
        >
          {recommendedProducts && recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <>
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div
                    className="
                    min-w-[150px] max-w-[150px] h-[220px]
                    bg-neutral-100 dark:bg-neutral-900
                    rounded shadow border-2 border-gray-300 dark:border-neutral-500
                    p-2 flex flex-col items-center justify-center text-center"
                    >
                    <div className="relative w-[100px] h-[100px] mb-2 flex items-center justify-center">
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-contain rounded"
                        sizes="100px"
                      />
                    </div>

                    <p className="text-sm line-clamp-2 px-1">{product.name}</p>
                  </div>
                </Link>
              </>
            ))
          ) : (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="
                min-w-[150px] max-h-[180px] bg-neutral-100 dark:bg-neutral-900
                rounded shadow p-2 flex flex-col items-center
                border-2 border-gray-300 dark:border-neutral-500
                 "
              >
                <Skeleton className="h-[100px] w-[100px] mb-2 rounded" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%] mt-1" />
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
          bg-neutral-100 dark:bg-neutral-900 border rounded-full p-2 shadow cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div >
    </>
  )
}
