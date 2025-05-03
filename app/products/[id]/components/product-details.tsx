'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, Share2, ShoppingBag, ShoppingCart } from 'lucide-react';
import type Stripe from 'stripe';
import { useCartStore } from '@/store/cart-store';
import { redirect } from 'next/navigation';
import { Recommendations } from './recommendations';
import { toast } from "react-toastify";
import { Flip } from "react-toastify";
import { formatCurrency } from '@/lib/helper';
import ExpandableDescription from './expandable';
import { useState } from 'react';

interface Props {
  product: Stripe.Product;
  recommendedProducts: Stripe.Product[];
}

const ProductDetail = ({ product, recommendedProducts }: Props) => {
  const { addItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const [quantity, setQuantity] = useState(1);

  const handleAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: product.images ? product.images[0] : null,
      quantity: quantity,
    });

    toast.success("Produto adicionado ao carrinho", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      transition: Flip,
      theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
    });

    return;
  };

  const handleBuyItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: product.images ? product.images[0] : null,
      quantity: quantity,
    });
    
    redirect('/checkout');
  };

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
    <article>
      <div className="container mx-auto px-4 pb-2 md:py-4 flex flex-col md:flex-row gap-10 items-start min-h-[calc(100vh-450px)]">
        {product.images?.[0] && (
          <div className="relative w-full md:w-[50%] h-[300px] md:h-[450px] overflow-hidden rounded-lg shadow-md bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-lg p-10"
              draggable={false}
            />
            <Button
              variant="outline"
              className="absolute left-2 bottom-2 cursor-pointer border-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200/75 transition-colors duration-200 border-gray-300 dark:border-neutral-500"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Compartilhar
            </Button>
          </div>
        )}

        <div className="w-full md:w-[50%] flex flex-col gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-black dark:text-white -mt-6 md:mt-0">{product.name}</h1>
            {product.description && (
              <ExpandableDescription text={product.description} />
            )}
          </div>

          <div className="flex items-center justify-between -mt-4 md:mt-0">
            <div className="flex self-end">
              {price?.unit_amount && (
                <p className="text-2xl font-semibold text-primary">
                  {formatCurrency(price.unit_amount / 100)}
                </p>
              )}
            </div>
            <div className="flex flex-col md:flex-row lg justify-center items-center md:gap-4 gap-2">
              <span className="text-gray-700 dark:text-gray-300 text-base font-medium">Quantidade</span>
              <div className="flex flex-row gap-2 items-center justify-center">
                <Button
                  variant="outline"
                  className="cursor-pointer border-2 bg-neutral-100 hover:bg-neutral-200/75 transition-colors duration-200 dark:bg-neutral-900 border-gray-300 dark:border-neutral-500"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity === 1}
                >
                  <MinusIcon />
                </Button>
                <span className="text-xl font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  className="cursor-pointer border-2 bg-neutral-100 hover:bg-neutral-200/75 transition-colors duration-200 dark:bg-neutral-900 border-gray-300 dark:border-neutral-500"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusIcon />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 mt-2 mb-4 md:mb-0">
            <Button
              className="w-full cursor-pointer bg-neutral-200 hover:bg-neutral-300/80 
            text-black hover:text-black dark:bg-white hover:dark:bg-white/90 dark:text-black"
              onClick={handleAddItem}>
              <ShoppingBag /> Adicionar ao carrinho
            </Button>

            <Button
              className="w-full cursor-pointer dark:bg-black dark:text-white 
            bg-black hover:bg-black/90 hover:dark:bg-black/90 text-white hover:text-white"
              onClick={handleBuyItem}>
              <ShoppingCart /> Comprar agora
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded shadow bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500">
          <h2 className="text-xl font-semibold mb-2">Detalhes</h2>
          <p className="text-sm">
            {product.description}
          </p>
        </div>

        <div className="border-2 p-4 rounded shadow border-gray-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">Especificações</h2>
          <ul className="text-sm mb-2">
            <li><strong>Marca:</strong> {product.name}</li>
            <li><strong>Categoria:</strong> {product.metadata.category}</li>
            <li><strong>Cor:</strong> {product.name}</li>
            <li><strong>Tamanho:</strong> {product.name}</li>
            <li><strong>Modelo:</strong> {product.name}</li>
            <li><strong>Garantia:</strong> 90 dias contra defeitos de fabricação</li>
          </ul>
        </div>
      </div>

      <Recommendations recommendedProducts={recommendedProducts} />
    </article>
  );
};

export default ProductDetail;
