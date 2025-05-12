import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      stripe_product_id,
      name,
      description,
      category,
      active,
      image_url,
      old_price,
      new_price,
      brand,
      color,
      model,
      warranty,
      size,
    } = body;

    if (!stripe_product_id) {
      return NextResponse.json({ error: "ID do produto do Stripe ausente." }, { status: 400 });
    }

    const updatedProduct = await stripe.products.update(stripe_product_id, {
      name,
      description,
      active,
      images: image_url,
      metadata: { category, brand, color, model, warranty, size },
    });

    let newPriceId = null;

    if (new_price !== old_price) {
      const newStripePrice = await stripe.prices.create({
        product: stripe_product_id,
        unit_amount: Math.round(new_price * 100),
        currency: "brl",
      });

      await stripe.products.update(stripe_product_id, {
        default_price: newStripePrice.id,
      });

      newPriceId = newStripePrice.id;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: new_price,
        active,
        image_url,
        category,
        brand,
        color,
        model,
        warranty,
        size
      })
      .eq("stripe_product_id", stripe_product_id);

    if (error) {
      console.error("Erro ao atualizar no Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updatedProduct, newPriceId });
  } catch (error: any) {
    console.error("Erro no update-product:", error);
    return NextResponse.json({ error: error.message || "Erro desconhecido." }, { status: 500 });
  }
}
