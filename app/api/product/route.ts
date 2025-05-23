import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import validateUserAdmin from '@/lib/validate-user-admin';
import { syncStripeProducts } from '@/lib/sync-products';

// GET ALL
export async function GET(req: NextRequest) {
  const user = await validateUserAdmin(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncStripeProducts();
    return NextResponse.json({ success: true, result });
  } catch {
    console.error("Erro ao sincronizar produtos.");
    return NextResponse.json({ success: false, error: "Erro ao sincronizar produtos" }, { status: 500 });
  }
}

// CREATE
export async function POST(req: NextRequest) {
  const user = await validateUserAdmin(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  } catch {
    console.error("Erro ao criar produto.");
    return NextResponse.json({ error: "Erro desconhecido." }, { status: 500 });
  }
}

// UPDATE
export async function PUT(req: NextRequest) {
  const user = await validateUserAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
      console.error("Erro ao atualizar no Supabase.");
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updatedProduct, newPriceId });
  } catch {
    console.error("Erro no update-product.");
    return NextResponse.json({ error: "Erro desconhecido." }, { status: 500 });
  }
}

// REMOVE
export async function PATCH(req: NextRequest) {
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

