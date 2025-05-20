'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, Share2, ShoppingBag, ShoppingCart, Star, StarHalf } from 'lucide-react';
import type Stripe from 'stripe';
import { useCartStore } from '@/store/cart-store';
import { redirect, useRouter } from 'next/navigation';
import { Recommendations } from './recommendations';
import { Bounce, Slide, toast } from "react-toastify";
import { Flip } from "react-toastify";
import { formatCurrency } from '@/lib/helper';
import ExpandableDescription from './expandable';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-context';
import { ProductReviews } from './product-reviews';
import { Review } from '@/types/review';
import { supabase } from '@/lib/supabase-client';
import Loading from '@/components/loading';

interface Props {
  product: Stripe.Product;
  recommendedProducts: Stripe.Product[];
}

const ProductDetails = ({ product, recommendedProducts }: Props) => {
  const { addItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const parcelamento = price.unit_amount && price.unit_amount / 100 / 10;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '');

  const { user } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAddItem = () => {
    if (!user) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: selectedImage,
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
  };

  const handleBuyItem = () => {
    if (!user) {
      router.push(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: selectedImage,
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
        .catch(() => {
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast.success("Link copiado para a área de transferência");
        })
        .catch(() => {
          fallbackCopy();
        });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const dummy = document.createElement("input");
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      toast.success("Link copiado para a área de transferência.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Slide,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    } catch {
      toast.error("Não foi possível copiar o link.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      const { data: orderItems, error: orderItemsError } = await supabase
        .from('orders_items')
        .select('id')
        .eq('product_id', product.id);

      if (orderItemsError) {
        setLoading(false);
        return;
      }

      const orderItemIds = orderItems.map(item => item.id);

      if (orderItemIds.length === 0) {
        setReviews([]);
        setAverage(null);
        setLoading(false);
        return;
      }

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, rating, comment, profile_id, order_item_id, updated_at')
        .in('order_item_id', orderItemIds)
        .eq('rated', true);

      if (reviewsError) {
        setLoading(false);
        return;
      }

      if (reviewsData.length === 0) {
        setReviews([]);
        setAverage(null);
        setLoading(false);
        return;
      }

      const profileIds = reviewsData.map(r => r.profile_id);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', profileIds);

      if (profilesError) {
        setLoading(false);
        return;
      }

      const profileMap = profilesData.reduce((acc, p) => {
        acc[p.id] = p.name;
        return acc;
      }, {} as Record<string, string>);

      const formattedReviews = reviewsData.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        user_name: profileMap[r.profile_id] || 'Anônimo',
        updated_at: r.updated_at,
      }));

      const avg = formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length;

      setReviews(formattedReviews);
      setAverage(avg);
      setLoading(false);
    };

    fetchReviews();
  }, [product.id]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-500 stroke-yellow-500"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4">
          <Star className="absolute inset-0 w-4 h-4 fill-amber-50/10 stroke-white" />
          <StarHalf className="absolute inset-0 w-4 h-4 fill-yellow-500 stroke-yellow-500" />
        </div>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 fill-amber-50/10 stroke-white "
        />
      );
    }

    return <div className="flex gap-0.5">{stars}</div>;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <article>
      <div className="container mx-auto sm:px-2 md:px-4 pb-2 md:py-4 flex flex-col md:flex-row gap-10 items-start min-h-[calc(100vh-450px)]">
        {selectedImage && (
          <div className="w-full md:w-[50%]">
            <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-lg shadow-md bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg p-10"
                draggable={false}
              />

              {average !== null && (
                <div className="absolute left-2 top-2 flex items-center gap-1 bg-black dark:bg-neutral-600 bg-opacity-60 px-2 py-1 rounded-md">
                  {renderStars(average)}
                  <span className="text-white text-sm ml-1 font-bold">({reviews.length})</span>
                </div>
              )}

              <Button
                variant="outline"
                className="absolute left-2 bottom-2 cursor-pointer border-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200/75 transition-colors duration-200 border-gray-300 dark:border-neutral-500"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
                Compartilhar
              </Button>
            </div>

            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative w-20 h-20 border-2 rounded-md cursor-pointer ${selectedImage === img
                      ? 'border-black dark:border-white'
                      : 'border-gray-300 dark:border-neutral-600'
                      }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx}`}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
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
                <div>
                  <span className="flex text-sm mt-4 md:mt-0 text-black dark:text-neutral-50">
                    {formatCurrency(price.unit_amount / 100)} em até 10x de {formatCurrency(parcelamento)} sem juros
                  </span>
                  <div>
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      <span className="mr-1 font-normal text-sm text-black dark:text-neutral-50">ou</span>
                      {formatCurrency(price.unit_amount / 100)}
                      <span className="ml-1 font-normal text-sm text-black dark:text-neutral-50">à vista no Pix</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row lg justify-center items-center md:gap-4 gap-2">
              <span className="text-neutral-900 dark:text-neutral-50 text-base font-medium mt-1 md:mt-0">Quantidade</span>
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

          <div className="flex flex-col items-center gap-4 md:mt-2 mb-4 md:mb-0">
            <Button
              className="w-full cursor-pointer bg-neutral-200 hover:bg-neutral-300/80 text-black hover:text-black dark:bg-white hover:dark:bg-white/90 dark:text-black"
              onClick={handleAddItem}
            >
              <ShoppingBag /> Adicionar ao carrinho
            </Button>

            <Button
              className="w-full cursor-pointer dark:bg-black dark:text-white bg-black hover:bg-black/90 hover:dark:bg-black/90 text-white hover:text-white"
              onClick={handleBuyItem}
            >
              <ShoppingCart /> Comprar agora
            </Button>
          </div>
        </div>
      </div>

      <div className="py-4 md:px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded shadow bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500">
          <h2 className="text-xl font-semibold mb-2">Detalhes</h2>
          <p className="text-sm">
            {product.description}
          </p>
        </div>

        <div className="border-2 px-2 py-4 md:px-4 rounded shadow border-gray-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold mb-2">Especificações</h2>
          <ul className="text-sm mb-2">
            {product.metadata.category &&
              <li><strong>Categoria:</strong> {product.metadata.category.charAt(0).toUpperCase() + product.metadata.category.slice(1)}</li>
            }
            {product.metadata.brand && <li><strong>Marca:</strong> {product.metadata.brand}</li>}
            {product.metadata.model && <li><strong>Modelo:</strong> {product.metadata.model}</li>}
            {product.metadata.color && <li><strong>Cor:</strong> {product.metadata.color}</li>}
            {product.metadata.size && <li><strong>Tamanho:</strong> {product.metadata.size}</li>}
            {product.metadata.warranty && <li><strong>Garantia:</strong> {product.metadata.warranty}</li>}
          </ul>
        </div>
      </div>

      <div className='md:px-4'>
        <ProductReviews productId={product.id} />
      </div>

      <Recommendations recommendedProducts={recommendedProducts} />
    </article>
  );
};

export default ProductDetails;
