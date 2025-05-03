import Link from 'next/link';
import { categories } from "@/lib/data";
import { ChevronRight } from 'lucide-react';

const Categories = () => {
  return (
    <div className="space-y-6 relative">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          Categorias
        </h2>
        <p className="text-md text-neutral-600 dark:text-neutral-400">
          Explore as categorias de nossos produtos.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.slice(0, 8).map((category) => (
          <Link
            key={category.name}
            href={`/products/category/${category.slug}`}
            className="flex flex-col items-center justify-center p-4 
            bg-neutral-100 dark:bg-neutral-900 border-2 border-gray-300 dark:border-neutral-500
            rounded-lg shadow hover:shadow-md transition text-center group"
          >
            <div className="text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-100">
              {category.name}
            </h3>
          </Link>
        ))}

        <div className="absolute lg:top-7 lg:right-0 lg:translate-x-0 lg:translate-y-4 -bottom-12 right-4 lg:left-auto lg:transform-none left-1/2 transform -translate-x-1/2">
          <Link href="/products" className="text-primary font-medium hover:underline flex items-center justify-center">
            <span>Ver Tudo</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Categories;
