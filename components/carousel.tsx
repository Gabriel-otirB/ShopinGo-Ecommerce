"use client";

import Stripe from "stripe";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  products: Stripe.Product[];
}

export const Carousel = ({ products }: Props) => {
  const [current, setCurrent] = useState<number>(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setDirection("right");
    setCurrent((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const handlePrev = useCallback(() => {
    setDirection("left");
    setCurrent((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  }, [handleNext]);

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetInterval]);

  const currentProduct = products[current];
  const price = currentProduct.default_price as Stripe.Price;

  return (
    <Card
      className="relative w-full h-full min-h-[400px] overflow-hidden rounded-lg shadow-md
        border-2 bg-neutral-100 border-gray-300 dark:border-neutral-500 dark:bg-neutral-900
        transition duration-300 ease-in-out py-0"
    >
      <div className="relative w-full h-full">
        <Link href={`/products/${currentProduct.id}`}>
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentProduct.id}
                initial={{
                  x: direction === "right" ? 100 : -100,
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{
                  x: direction === "right" ? -100 : 100,
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={currentProduct.images?.[0] || ""}
                  alt={currentProduct.name}
                  style={{ objectFit: "contain" }}
                  fill
                  draggable={false}
                  className="w-full h-full py-8"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70 z-10" />

          <motion.div
            key={currentProduct.id}
            initial={{
              x: direction === "right" ? 100 : -100,
              opacity: 0,
              scale: 0.95,
            }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{
              x: direction === "right" ? -100 : 100,
              opacity: 0,
              scale: 0.95,
            }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full z-20 flex items-center justify-center"
          >
            <CardContent className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center h-full z-20">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                draggable={false}
                className="
                  text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-md
                  overflow-hidden whitespace-nowrap text-ellipsis max-w-[250px] sm:max-w-[1000px] select-none"
              >
                {currentProduct.name}
              </motion.h2>
              {price && price.unit_amount && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  draggable={false}
                  className="text-xl font-medium text-white drop-shadow-md select-none"
                >
                  R${(price.unit_amount / 100).toFixed(2)}
                </motion.p>
              )}
            </CardContent>
          </motion.div>
        </Link>

        <div className="absolute z-30 top-1/2 left-0 right-0 flex justify-between items-center px-4 transform -translate-y-1/2">
          <button
            onClick={() => {
              handlePrev();
              resetInterval();
            }}
            className="bg-black/40 hover:bg-black/60 transition-all duration-300 text-white p-2 rounded-full cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => {
              handleNext();
              resetInterval();
            }}
            className="bg-black/40 hover:bg-black/60 transition-all duration-300 text-white p-2 rounded-full cursor-pointer"
          >
            <ArrowRight />
          </button>
        </div>

        <div className="absolute bottom-4 z-30 left-1/2 transform -translate-x-1/2 flex gap-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? "right" : "left");
                setCurrent(idx);
                resetInterval();
              }}
              className={cn(
                "w-3 h-3 rounded-full cursor-pointer",
                idx === current ? "bg-white" : "bg-white/40"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
