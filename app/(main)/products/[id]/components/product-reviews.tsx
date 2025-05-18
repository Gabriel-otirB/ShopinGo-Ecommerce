'use client';

import { useEffect, useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { formatDate } from '@/lib/helper';
import { Review } from '@/types/review';

interface Props {
  productId: string;
}

export const ProductReviews = ({ productId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);

      const { data: orderItems, error: orderItemsError } = await supabase
        .from('orders_items')
        .select('id')
        .eq('product_id', productId);

      if (orderItemsError) {
        console.error(orderItemsError);
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
        .in('order_item_id', orderItemIds);

      if (reviewsError) {
        console.error(reviewsError);
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
        console.error(profilesError);
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
  }, [productId]);

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
          <Star className="absolute inset-0 w-4 h-4 fill-amber-50/20 stroke-gray-400 dark:stroke-neutral-200" />
          <StarHalf className="absolute inset-0 w-4 h-4 fill-yellow-500 stroke-yellow-500" />
        </div>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 fill-amber-50/20 stroke-gray-400 dark:stroke-neutral-200"
        />
      );
    }

    return <div className="flex gap-0.5">{stars}</div>;
  };

  if (loading) {
    return <p className="text-neutral-600 dark:text-neutral-300 text-center mt-4">Carregando avaliações...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-neutral-600 dark:text-neutral-300 text-center mt-4">Ainda não há avaliações para este produto.</p>;
  }

  const reviewsToShow = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="border-2 p-4 rounded shadow border-gray-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-900 mt-4">
      <h2 className="text-xl font-semibold mb-2">Avaliações</h2>

      {average !== null && (
        <div className="flex items-center gap-2 mb-4">
          {renderStars(average)}
          <span className="text-lg font-medium text-neutral-900 dark:text-neutral-50">
            {average.toFixed(1)} de 5
            <span
              className="ml-2 text-lg font-medium text-neutral-900/70 dark:text-neutral-50/70"
            >
              ({reviews.length} avaliação{reviews.length > 1 ? 's' : ''})
            </span>
          </span>
        </div>
      )}

      <ul className="space-y-4">
        {reviewsToShow.map(review => (
          <li
            key={review.id}
            className="border rounded p-3 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600"
          >
            <div className="flex flex-col justify-center mb-1">
              {renderStars(review.rating)}
              <div>
                <span className="text-sm font-bold">{review.user_name}</span>
                <span className='mx-1 text-xs text-neutral-500'>|</span>
                <span className="text-xs text-neutral-500">{formatDate(review.updated_at)}</span>
              </div>
            </div>
            {review.comment ? (
              <p className="text-sm text-neutral-800 dark:text-neutral-300">{review.comment}</p>
            ) : (
              <p className="text-sm text-neutral-800/70 dark:text-neutral-300/70">Sem comentários.</p>
            )}
          </li>
        ))}
      </ul>

      {!showAll && reviews.length > 3 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-black dark:text-white underline cursor-pointer font-medium"
            aria-label="Ver todas as avaliações"
          >
            Ver todas
          </button>
        </div>
      )}
    </div>
  );
};
