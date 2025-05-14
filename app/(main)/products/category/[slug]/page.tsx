import ScrollTop from '@/components/scroll-top';
import { ProductList } from '../../components/product-list';
import { stripe } from '@/lib/stripe';
import { Stripe } from 'stripe'; // Import the Stripe namespace

// ISR revalidation
// export const revalidate = 3600;

export default async function CategoryPage({ params }: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  // Initialize an array to store the filtered products
  let allFilteredProducts: (Stripe.Product & { default_price?: Stripe.Price })[] = [];

  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  // Retrieve all paginated products and filter by category
  while (hasMore) {
    // Define the correct type for the Stripe API response
    const response: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ["data.default_price"],
    });

    // Filter the products on the current page by category
    const filteredPageProducts = response.data
      .filter((product: Stripe.Product) => {
        const productCategory = product.metadata?.category?.toLowerCase();
        return productCategory === slug.toLowerCase();
      })
      .map((product) => ({
        ...product,
        default_price: product.default_price && typeof product.default_price !== 'string'
          ? product.default_price
          : undefined,
      }));

    allFilteredProducts = [...allFilteredProducts, ...filteredPageProducts];

    // Check if there are more products to retrieve
    hasMore = response.has_more;

    // If there are more products, set the `starting_after` to continue pagination
    if (hasMore) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  return (
    <div>
      <ScrollTop />
      <ProductList products={allFilteredProducts} />
    </div>
  );
}
