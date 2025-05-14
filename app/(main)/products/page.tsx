import { stripe } from "@/lib/stripe";
import { ProductList } from './components/product-list';
import ScrollTop from '@/components/scroll-top';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ShopinGo | Produtos",
  description: "Produtos",
};

export default async function CategoryPage() {
  const products = await stripe.products
    .list({
      active: true,
      expand: ["data.default_price"],
    })
    .autoPagingToArray({ limit: 1000 });

  const parsedProducts = products.map((product) => ({
    ...product,
    default_price:
      product.default_price && typeof product.default_price !== 'string'
        ? product.default_price
        : undefined,
  }));

  return (
    <div>
      <ScrollTop />
      <ProductList products={parsedProducts} />
    </div>
  );
}
