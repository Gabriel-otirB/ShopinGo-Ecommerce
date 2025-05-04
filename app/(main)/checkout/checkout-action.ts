'use server';

import { stripe } from '@/lib/stripe';
import { CartItem } from '@/store/cart-store';
import { redirect } from 'next/navigation';

export const checkoutAction = async (formData: FormData): Promise<void> => {
  const itemsJson = formData.get("items") as string;
  const freightJson = formData.get("freight") as string;

  const items = JSON.parse(itemsJson) as CartItem[];
  const freight = freightJson ? JSON.parse(freightJson) : null;

  const line_items = items.map((item: CartItem) => ({
    price_data: {
      currency: "brl",
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  if (freight) {
    line_items.push({
      price_data: {
        currency: "brl",
        product_data: { name: `Frete: ${freight.name}` },
        unit_amount: freight.price,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  redirect(session.url!);
};
