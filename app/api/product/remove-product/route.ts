import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import validateUserAdmin from '@/lib/validate-user-admin';

export async function PUT(req: NextRequest) {
  const user = await validateUserAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await req.json();

  const { data: product, error } = await supabase
    .from("products")
    .select("stripe_product_id")
    .eq("id", productId)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  try {
    await stripe.products.update(product.stripe_product_id, {
      active: false,
    });

    const { error: updateError } = await supabase
      .from("products")
      .update({ active: false })
      .eq("id", productId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Produto desativado com sucesso" });
  } catch {
    console.error("Erro ao desativar produto.");
    return NextResponse.json({ error: "Erro ao desativar produto" }, { status: 500 });
  }
}
