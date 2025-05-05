'use client';

import Link from "next/link";
import Stripe from "stripe";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/helper';

interface Props {
  product: Stripe.Product;
}

const ProductCard = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;
  const parcelamento = price.unit_amount && price.unit_amount / 100 / 10;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <article key={product.name} className="cursor-default group">
      <Card className="
        flex flex-col gap-4 gap-y-0 h-[400px] 
        bg-neutral-100 dark:bg-neutral-900
        border-2 border-gray-300 dark:border-neutral-500
      ">
        {product.images && product.images[0] && (
          <div className="relative w-full h-[300px] overflow-hidden group-hover:scale-[1.03] transition-transform duration-300">
            {!isImageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full rounded-t-lg" />
            )}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              draggable={false}
              className={`rounded-t-lg transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
        )}
        <CardHeader className="p-4 pt-0 pb-0 -mb-1">
          <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white truncate">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 flex-grow flex flex-col justify-between">
          {product.description && (
            <p className="text-gray-700 text-sm dark:text-gray-300 line-clamp-3 mb-1">
              {product.description}
            </p>
          )}
          {price && price.unit_amount && (
            <>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {formatCurrency(price.unit_amount/100)}
                <span className="ml-1 font-normal text-sm text-black dark:text-neutral-50">à vista no Pix</span>
              </p>
              <p className="text-sm text-black dark:text-neutral-50">
                ou em até 10x de {formatCurrency(parcelamento)} sem juros
              </p>
            </>
          )}
          <Link href={`/products/${product.id}`}>
            <Button 
            className="
            mt-2 inline-flex items-center justify-center w-full px-6 py-3 bg-black text-white 
            cursor-pointer hover:bg-black/90 dark:hover:bg-black/90">
              Ver detalhes
            </Button>
          </Link>
        </CardContent>
      </Card>
    </article>
  );
};

export default ProductCard;
