"use client";

import Stripe from "stripe";
import { Card, CardContent, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  products: Stripe.Product[];
}

export const Carousel = ({ products }: Props) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products[current];
  const price = currentProduct.default_price as Stripe.Price;

  return (
    <Card className="relative w-full h-full overflow-hidden rounded-lg shadow-md border-gray-300">
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentProduct.images?.[0] || ""}
              alt={currentProduct.name}
              fill
              className="object-cover w-full h-full"
            />

            <CardContent className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {currentProduct.name}
              </CardTitle>
              {price && price.unit_amount && (
                <p className="text-xl text-white">
                  ${(price.unit_amount / 100).toFixed(2)}
                </p>
              )}
            </CardContent>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};
