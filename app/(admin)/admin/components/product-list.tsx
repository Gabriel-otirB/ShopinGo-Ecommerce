import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDisclosure } from "@/hooks/use-disclosure";
import ProductForm from "./product-form";
import ProductDeleteAlert from "./product-delete-alert";
import { Bounce, Flip, toast } from 'react-toastify';
import Link from 'next/link';
import { Product } from '@/types/product';
import { supabase } from '@/lib/supabase-client';

interface ProductListProps {
  products: Product[];
  search: string;
  onReload: () => void;
}

const ProductList = ({ products, search, onReload }: ProductListProps) => {
  const [visibleProductsCount, setVisibleProductsCount] = useState(10);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const { isOpen, open, close } = useDisclosure();


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleProductsCount);

  const handleShowMore = () => {
    setVisibleProductsCount((prev) => prev + 10);
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    open();
  };

  const handleCreateClick = () => {
    setCurrentProduct(null);
    open();
  };

  const handleDeleteProduct = async (productId: string | undefined) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    if (!token) {
      toast.error("Voce precisa estar autenticado.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      })
      return;
    }

    try {
      const response = await fetch("/api/product", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Erro ao remover o produto");

      toast.success("Produto removido com sucesso!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Flip,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
      onReload();
    } catch {
      toast.error("Erro ao remover o produto.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleCreateClick} className="cursor-pointer">+ Adicionar Produto</Button>

      {visibleProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        visibleProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded p-2 border-2 border-gray-300 dark:border-neutral-500">
            <div className="flex items-center gap-4">
              {product.image_url.length > 0 && (
                <div className="relative w-12 h-12">
                  <Link href={`/products/${product.stripe_product_id}`}>
                    <Image
                      src={product.image_url[0]}
                      alt={product.name}
                      fill
                      className="object-contain rounded"
                      unoptimized
                    />
                  </Link>
                </div>
              )}
              <div>
                <Link href={`/products/${product.stripe_product_id}`}>
                  <div className="font-medium line-clamp-1 max-w-[80px] sm:max-w-[320px] mr-1 sm:mr-0">{product.name}</div>
                </Link>
                <div className="text-sm text-muted-foreground">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </div>
              </div>
            </div>
            <div className="space-x-2 space-y-2 sm:space-y-0 flex">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(product)}
                className="cursor-pointer"
              >
                Editar
              </Button>
              <ProductDeleteAlert
                productId={product.id}
                onConfirm={handleDeleteProduct}
              />
            </div>
          </div>
        ))
      )}

      {filteredProducts.length > 10 && (
        <div className="flex justify-center mt-4">
          {visibleProductsCount < filteredProducts.length ? (
            <Button onClick={handleShowMore} className="cursor-pointer">Ver mais</Button>
          ) : (
            <Button onClick={() => setVisibleProductsCount(10)} className="cursor-pointer">Ver menos</Button>
          )}
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent className="border-2 border-gray-300 dark:border-neutral-500">
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Editar Produto" : "Criar Produto"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={currentProduct}
            isEditMode={!!currentProduct}
            onSubmit={() => {
              close();
              onReload();
            }}
            onClose={close}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
