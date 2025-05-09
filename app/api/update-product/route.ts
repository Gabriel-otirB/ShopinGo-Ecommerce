import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

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

  return NextResponse.json({
    updatedProduct,
    newPriceId,
  });
}
