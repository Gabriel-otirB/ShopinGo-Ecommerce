"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  image_url: string[];
  stripe_product_id: string;
}

const ProductList = ({ products, search }: { products: Product[], search: string }) => {
  const [visibleProductsCount, setVisibleProductsCount] = useState(10);

  // Filtrar os produtos conforme o valor da busca
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Exibir apenas os produtos visíveis
  const visibleProducts = filteredProducts.slice(0, visibleProductsCount);

  // Função para carregar mais produtos
  const handleShowMore = () => {
    setVisibleProductsCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="space-y-2 mt-4">
      {visibleProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        visibleProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between border rounded p-2">
            <div className="flex items-center gap-2">
              {/* Renderiza imagem apenas se houver URL no array */}
              {product.image_url && product.image_url.length > 0 && (
                <div className="relative w-12 h-12">
                  <Image
                    src={product.image_url[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
              )}

              <span className="truncate max-w-[150px] lg:max-w-[400px]">{product.name}</span>
            </div>

            <div className="space-x-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="destructive" size="sm">Remover</Button>
            </div>
          </div>
        ))
      )}

      {/* Botão "Ver mais" */}
      {visibleProductsCount < filteredProducts.length && filteredProducts.length >= 10 && (
        <Button onClick={handleShowMore} className="mt-4">Ver mais</Button>
      )}
    </div>
  );
};

export default ProductList;
