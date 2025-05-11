import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      category,
      active,
      image_url,
    } = body;

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return NextResponse.json({ error: "Preço inválido." }, { status: 400 });
    }

    // Criação do produto no Stripe (sem default_price)
    const product = await stripe.products.create({
      name,
      description,
      images: image_url,
      active,
      metadata: { category },
    });

    // Criação do preço em centavos
    const unitAmount = Math.round(priceValue * 100);
    const createdPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: unitAmount,
      currency: "brl",
    });

    // Atualiza o produto com o preço padrão
    const updatedProduct = await stripe.products.update(product.id, {
      default_price: createdPrice.id,
    });

    // Persistência no Supabase
    const { error: dbError } = await supabase.from("products").insert([{
      name,
      description,
      price: priceValue,
      category,
      active,
      image_url,
      stripe_product_id: product.id,
    }]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ product: updatedProduct, price: createdPrice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro desconhecido." }, { status: 500 });
  }
}
