import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, category, active, image_url, brand, color, model, warranty, size } = body;

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return NextResponse.json({ error: "Preço inválido." }, { status: 400 });
    }

    const product = await stripe.products.create({
      name,
      description,
      images: image_url,
      active,
      metadata: { category, brand, color, model, warranty, size },
    });

    const createdPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(priceValue * 100),
      currency: "brl",
    });

    await stripe.products.update(product.id, {
      default_price: createdPrice.id,
    });

    const { error: dbError } = await supabase.from("products").insert([{
      name,
      description,
      price: priceValue,
      active,
      image_url,
      stripe_product_id: product.id,
      category,
      brand,
      color,
      model,
      warranty,
      size
    }]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ product, price: createdPrice });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro desconhecido." }, { status: 500 });
  }
}
