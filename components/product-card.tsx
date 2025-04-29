import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  product: Stripe.Product;
}

const ProductCard = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;

  return (

    <article key={product.name} className="cursor-default group">
      <Card className="
      flex flex-col gap-4 gap-y-0 h-[400px] 
    bg-neutral-100 dark:bg-neutral-900
      border-2 border-gray-300 dark:border-neutral-500
      ">
        {product.images && product.images[0] && (
          <div className="relative w-full h-[300px] overflow-hidden group-hover:scale-[1.03] transition-transform duration-300">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
              style={{ objectFit: "contain" }}
              draggable={false}
              className="rounded-t-lg"
            />
          </div>
        )}
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white truncate">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 flex-grow flex flex-col justify-between">
          {product.description && (
            <p className="text-gray-600 text-sm dark:text-gray-300 line-clamp-3">
              {product.description}
            </p>
          )}
          {price && price.unit_amount && (
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              R$ {(price.unit_amount / 100).toFixed(2)}
            </p>
          )}
          <Link href={`/products/${product.id}`}>
            <Button className="
             mt-2 inline-flex items-center justify-center w-full 
             px-6 py-3 bg-black text-white 
             cursor-pointer hover:bg-black dark:hover:bg-black">
              Ver detalhes
            </Button>
          </Link>
        </CardContent>
      </Card>
    </article>


  );
};

export default ProductCard;