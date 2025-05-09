import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Atualiza o produto no Stripe
  const updatedProduct = await stripe.products.update(body.stripe_product_id, {
    name: body.name,
    description: body.description,
    active: body.active,
    images: body.image_url,
    metadata: { category: body.category },
  });

  let newPriceId = null;

  // Se o preço mudou, cria um novo
  if (body.new_price && body.new_price !== body.old_price) {
    const newPrice = await stripe.prices.create({
      product: body.stripe_product_id,
      unit_amount: Math.round(body.new_price * 100),
      currency: "brl",
    });

    // Define o novo preço padrão no produto
    await stripe.products.update(body.stripe_product_id, {
      default_price: newPrice.id,
    });

    newPriceId = newPrice.id;
  }

  // Atualiza o registro do produto no Supabase
  const { error } = await supabase
    .from("products") // Tabela onde os produtos estão armazenados
    .update({
      name: body.name,
      description: body.description,
      price: body.new_price || body.old_price,
      category: body.category,
      active: body.active,
      image_url: body.image_url,
    })
    .eq("stripe_product_id", body.stripe_product_id); // Filtra pelo stripe_product_id

  if (error) {
    console.log("Erro ao atualizar no Supabase:", error.message); // Log para debug
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    updatedProduct,
    newPriceId,
  });
}
