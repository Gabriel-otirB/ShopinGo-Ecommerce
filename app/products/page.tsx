import { stripe } from "@/lib/stripe";
import { ProductList } from "@/app/products/components/product-list";

// ISR revalidation
// export const revalidate = 3600;

export default async function CategoryPage() {
  const products = await stripe.products
    .list({
      active: true,
      expand: ["data.default_price"],
    })
    .autoPagingToArray({ limit: 1000 });

  return (
    <div>
      <ProductList products={products} />
    </div>
  );
}
