import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const product = await stripe.products.create({
    name: body.name,
    description: body.description,
    images: body.image_url, // deve ser array
    active: body.active,
    metadata: {
      category: body.category,
    },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(body.price * 100), // em centavos
    currency: "brl",
  });

  return NextResponse.json({ product, price });
}
