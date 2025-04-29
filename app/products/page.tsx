import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";

export default async function Category() {
  const products = await stripe.products.list({
    limit: 16,
    expand: ["data.default_price"],
  });

  return (
    <div className="pb-8">
      <ProductList products={products.data} />
    </div>
  );
}
