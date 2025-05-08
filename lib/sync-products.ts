import { stripe } from './stripe';
import { supabase } from './supabase-client';

export const syncStripeProducts = async () => {
  try {
    let allProducts: any[] = [];
    let startingAfter: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await stripe.products.list({
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

    console.log("Todos os produtos do Stripe:", allProducts);

    const { data: localProducts, error } = await supabase
      .from("products")
      .select("id, stripe_product_id");

    if (error) throw new Error(error.message);

    const existingIds = localProducts.map((p) => p.stripe_product_id);
    const newProducts = allProducts.filter(
      (product) => !existingIds.includes(product.id)
    );

    console.log("Produtos novos a serem adicionados:", newProducts);

    for (const product of newProducts) {
      console.log("Inserindo produto:", product.name);

      const { error: insertError } = await supabase.from("products").insert([{
        name: product.name,
        description: product.description,
        price: 0,
        active: product.active,
        image_url: product.images.length ? product.images : [],
        stripe_product_id: product.id,
      }]);

      if (insertError) {
        console.error("Erro ao inserir produto:", insertError.message);
        return { success: false, error: insertError.message };
      }
    }

    return { success: true, added: newProducts.length };
  } catch (err: any) {
    console.error("Erro ao sincronizar produtos com Stripe:", err);
    return { success: false, error: err.message };
  }
};
