'use client'

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, Share2 } from 'lucide-react';
import { useState } from 'react';
import type Stripe from 'stripe';

interface Props {
  product: Stripe.Product;
}

const ProductDetail = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;
  const [quantity, setQuantity] = useState(0);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Confira este produto: ${product.name}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log('Erro ao compartilhar', error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-10 items-start">
      {product.images?.[0] && (
        <div className="
        relative w-full md:w-[50%] h-[300px] md:h-[400px]
        overflow-hidden rounded-lg shadow-md
        bg-neutral-100 dark:bg-neutral-900
        border-2 border-gray-300 dark:border-neutral-500">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg"
            draggable={false}
          />
        </div>
      )}

      <div className="w-full md:w-[50%] flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">{product.name}</h1>
          {product.description && (
            <p className="text-gray-700 dark:text-gray-300 text-base">{product.description}</p>
          )}
        </div>

        {price?.unit_amount && (
          <p className="text-2xl font-semibold text-primary">
            R$ {(price.unit_amount / 100).toFixed(2)}
          </p>
        )}

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className='cursor-pointer border-2 
            bg-neutral-100 dark:bg-neutral-900
            border-gray-300 dark:border-neutral-500'
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 0))}
          >
            <MinusIcon />
          </Button>
          <span className="text-xl font-semibold">{quantity}</span>
          <Button
            variant="outline"
            className='cursor-pointer border-2 
            bg-neutral-100 dark:bg-neutral-900
            border-gray-300 dark:border-neutral-500'
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            <PlusIcon />
          </Button>
        </div>

        <Button
          variant="outline"
          className="
          flex items-center gap-2 w-fit cursor-pointer border-2
          bg-neutral-100 dark:bg-neutral-900
        border-gray-300 dark:border-neutral-500"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
