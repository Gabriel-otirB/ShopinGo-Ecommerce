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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  image_url: string[];
  stripe_product_id: string;
}

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

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch("/api/product/remove-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Erro ao remover o produto");

      toast.success("Produto desativado com sucesso!", {
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
    } catch (error) {
      toast.error("Erro ao desativar o produto.", {
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
          <div key={product.id} className="flex items-center justify-between border rounded p-2">
            <div className="flex items-center gap-4">
              {product.image_url.length > 0 && (
                <div className="relative w-12 h-12">
                  <Image
                    src={product.image_url[0]}
                    alt={product.name}
                    fill
                    className="object-contain rounded"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <div className="font-medium line-clamp-1 max-w-[320px]">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </div>
              </div>
            </div>
            <div className="space-x-2">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Editar Produto" : "Criar Produto"}</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={currentProduct || { name: "", description: "", price: 0, image_url: [] }}
            isEditMode={!!currentProduct}
            onSubmit={() => {
              close();
              onReload(); // recarrega após criar/editar
            }}
            onClose={close}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
