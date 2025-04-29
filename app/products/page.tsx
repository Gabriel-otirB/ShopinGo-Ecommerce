import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";

export default async function ProductsPage() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  return (
    <div className="pb-8 min-h-[calc(100vh-450px)]">
      
      <ProductList products={products.data} />
    </div>
  );
}
