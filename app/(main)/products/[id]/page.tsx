import ProductDetail from './components/product-details';
import { stripe } from '@/lib/stripe';

const ProductPage = async (
  { params }: {
    params: Promise<{ id: string }>;
  }) => {

  const { id } = await params;
  const product = await stripe.products.retrieve(id, {
    expand: ["default_price"],
  });

  const plainProduct = JSON.parse(JSON.stringify(product));

  const category = plainProduct.metadata?.category;

  const allProducts = await stripe.products.list({
    active: true,
    limit: 100,
    expand: ['data.default_price'],
  });

  const recommendedProducts = allProducts.data.filter(
    (prod) => prod.metadata?.category === category && prod.id !== id
  ).slice(0, 8);

  const plainRecommendedProducts = JSON.parse(JSON.stringify(recommendedProducts));

  return (
    <>
      <ProductDetail product={plainProduct} recommendedProducts={plainRecommendedProducts} />
    </>
  )
}

export default ProductPage;
