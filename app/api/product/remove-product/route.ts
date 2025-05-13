import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const { productId } = await req.json();

  // Get the product from the database to get the stripe_product_id
  const { data: product, error } = await supabase
    .from("products")
    .select("stripe_product_id")
    .eq("id", productId)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  try {
    // Disable the product on Stripe
    await stripe.products.update(product.stripe_product_id, {
      active: false,
    });

    // Update the product in the database to make it inactive
    const { error: updateError } = await supabase
      .from("products")
      .update({ active: false })
      .eq("id", productId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Produto desativado com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao desativar produto" }, { status: 500 });
  }
}
