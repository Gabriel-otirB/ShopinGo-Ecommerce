import Stripe from 'stripe';
import { stripe } from './stripe';
import { supabaseAdmin as supabase } from './supabase-admin';

export const syncStripeProducts = async () => {
  try {
    let allProducts: Stripe.Product[] = [];
    let startingAfter: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
        active: true,
        limit: 100,
        ...(startingAfter && { starting_after: startingAfter }),
      });

      allProducts = allProducts.concat(response.data);
      hasMore = response.has_more;
      if (hasMore) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    const { data: localProducts, error } = await supabase
      .from("products")
      .select("stripe_product_id");

    if (error) throw new Error(error.message);

    const existingIds = localProducts.map((p) => p.stripe_product_id);
    const newProducts = allProducts.filter(
      (product) => !existingIds.includes(product.id)
    );

    for (const product of newProducts) {
      let priceValue = 0;

      if (product.default_price) {
        try {
          const price = await stripe.prices.retrieve(product.default_price as string);
          if (price.unit_amount !== null) {
            priceValue = price.unit_amount / 100; // Stripe returns price in cents
          }
        } catch (err) {
          console.warn(`Erro ao buscar preço do produto ${product.id}:`, err);
        }
      }

      const { error: insertError } = await supabase.from("products").insert([{
        name: product.name,
        description: product.description || "",
        price: priceValue,
        category: product.metadata.category || "",
        active: product.active,
        image_url: product.images || [],
        stripe_product_id: product.id,
      }]);

      if (insertError) {
        console.error("Erro ao inserir produto:", insertError.message);
        return { success: false, error: insertError.message };
      }
    }

    return { success: true, added: newProducts.length };
  } catch (error) {
    console.error("Erro ao sincronizar produtos com Stripe:", error);
    return { success: false, error: error };
  }
};
