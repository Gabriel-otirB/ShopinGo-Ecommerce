'use server';

import { stripe } from '@/lib/stripe';
import { CartItem } from '@/store/cart-store';
import { redirect } from 'next/navigation';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const checkoutAction = async (formData: FormData): Promise<void> => {
  const items = JSON.parse(formData.get("items") as string) as CartItem[];
  const freight = formData.get("freight") ? JSON.parse(formData.get("freight") as string) : null;
  const totalPrice = Number(formData.get("total_price") ?? 0);
  const userId = formData.get("user_id") as string;

  if (!userId) throw new Error("Usuário não autenticado");

  const address = {
    street: formData.get("street") as string,
    number: formData.get("number") as string,
    complement: formData.get("complement") as string,
    neighborhood: formData.get("neighborhood") as string,
    city: formData.get("city") as string,
    state: formData.get("uf") as string,
    zipcode: formData.get("cep") as string,
  };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) throw new Error("Erro ao buscar profile");

  const { data: order, error: insertOrderError } = await supabase
    .from("orders")
    .insert({
      profile_id: profile.id,
      total_price: totalPrice,
      payment_method: "undefined",
      shipping_price: freight?.price || 0,
      shipping_provider: freight?.name.toLowerCase(),
      status: "processing",
      address_street: address.street,
      address_number: address.number,
      address_complement: address.complement,
      address_neighborhood: address.neighborhood,
      address_city: address.city,
      address_state: address.state,
      address_zipcode: address.zipcode,
    })
    .select()
    .single();

  if (insertOrderError) {
    console.error("Erro ao salvar pedido:", insertOrderError);
    throw insertOrderError;
  }

  const { error: insertOrderItemError } = await supabase.from("orders_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }))
  );

  if (insertOrderItemError) {
    console.error("Erro ao salvar items do pedido:", insertOrderItemError);
    throw insertOrderItemError;
  }

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
    metadata: {
      pedido_id: order.id.toString(),
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
  });

  redirect(session.url!);
};
