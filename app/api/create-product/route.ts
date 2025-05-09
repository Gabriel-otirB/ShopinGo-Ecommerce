import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Cria o produto primeiro, sem default_price
  const product = await stripe.products.create({
    name: body.name,
    description: body.description,
    images: body.image_url,
    active: body.active,
    metadata: {
      category: body.category,
    },
  });

  // Cria o preço
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(body.price * 100), // em centavos
    currency: "brl",
  });

  // Atualiza o produto para definir o preço como padrão
  const updatedProduct = await stripe.products.update(product.id, {
    default_price: price.id,
  });

  return NextResponse.json({ product: updatedProduct, price });
}
