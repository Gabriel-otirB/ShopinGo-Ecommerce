import { stripe } from "@/lib/stripe";
import { ProductList } from "@/app/products/components/product-list";
import ScrollTop from '@/components/scroll-top'; 

export default async function CategoryPage() {
  const products = await stripe.products
    .list({
      active: true,
      expand: ["data.default_price"],
    })
    .autoPagingToArray({ limit: 1000 });

  return (
    <div>
      <ScrollTop />
      <ProductList products={products} />
    </div>
  );
}
