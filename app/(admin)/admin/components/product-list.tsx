"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDisclosure } from '@/hooks/use-disclosure';
import ProductForm from './product-form';
import ProductDeleteAlert from './product-delete-alert';

// Interface de Produto
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
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { isOpen, open, close } = useDisclosure();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleProductsCount);

  const handleShowMore = () => {
    setVisibleProductsCount(prev => prev + 10);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    open();
  };

  const handleCreateClick = () => {
    setCurrentProduct(null);
    open();
  };

  return (
    <div className="space-y-2 mt-4">
      <Button onClick={handleCreateClick} className="cursor-pointer mt-4">+ Adicionar Produto</Button>

      {visibleProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        visibleProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between border rounded p-2">
            <div className="flex items-center gap-2">
              {product.image_url && product.image_url.length > 0 && (
                <div className="relative w-12 h-12">
                  <Image
                    src={product.image_url[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
              <span className="truncate max-w-[150px] lg:max-w-[400px]">{product.name}</span>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEditClick(product)} className="cursor-pointer">Editar</Button>
              <ProductDeleteAlert
                onConfirm={() => {
                  console.log("Remover produto:", product.id);
                }}
              />
            </div>
          </div>
        ))
      )}

      {visibleProductsCount < filteredProducts.length && filteredProducts.length >= 10 && (
        <Button onClick={handleShowMore} className="mt-4">Ver mais</Button>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Editar Produto" : "Criar Produto"}</DialogTitle>
          </DialogHeader>

          <ProductForm
            product={currentProduct || { name: "", description: "", price: 0, image_url: "" }}
            isEditMode={!!currentProduct}
            onSubmit={(data) => {
              if (currentProduct) {
                console.log("Atualizar:", data);
              } else {
                console.log("Criar:", data);
              }
              close();
            }}
            onClose={close}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
