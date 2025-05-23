"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { uploadImageToStorage } from "@/lib/upload-image";
import { Bounce, Flip, toast } from "react-toastify";
import { Product } from '@/types/product';
import { supabase } from '@/lib/supabase-client';

interface ProductFormProps {
  product: Product | null;
  onSubmit: (data: Product) => void;
  onClose: () => void;
  isEditMode: boolean;
}

const ProductForm = ({ product, onSubmit, onClose, isEditMode }: ProductFormProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(product?.image_url || []);
  const [active, setActive] = useState<boolean>(product?.active ?? true);
  const [errors, setErrors] = useState<{ name?: string; description?: string; category?: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.sort((a, b) => a.lastModified - b.lastModified);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    const getInputValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() || "";

    const name = getInputValue("name");
    const description = getInputValue("description");
    const priceValue = getInputValue("price");
    const category = getInputValue("category");
    const brand = getInputValue("brand");
    const color = getInputValue("color");
    const model = getInputValue("model");
    const warranty = getInputValue("warranty");
    const size = getInputValue("size");

    const price = parseFloat(priceValue);

    const newErrors: typeof errors = {};
    if (name.length > 250) newErrors.name = "O nome deve ter no máximo 250 caracteres.";
    if (description.length > 500) newErrors.description = "A descrição deve ter no máximo 500 caracteres.";
    if (!category) newErrors.category = "A categoria é obrigatória.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (isNaN(price) || price <= 0) {
      toast.error("O preço deve ser um número válido maior que zero.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
      return;
    }

    let uploadedImageUrls: string[] = [];

    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const uploadedUrl = await uploadImageToStorage(file);
        if (!uploadedUrl) {
          toast.error("Erro ao fazer upload da imagem.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            transition: Bounce,
            theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
          });
          return;
        }
        uploadedImageUrls.push(uploadedUrl);
      }
    } else {
      uploadedImageUrls = product?.image_url || [];
    }

    const isUpdate = !!product?.stripe_product_id;

    const body = isUpdate
      ? {
        stripe_product_id: product.stripe_product_id,
        name,
        description,
        old_price: product.price,
        new_price: price,
        active,
        image_url: uploadedImageUrls,
        category,
        brand,
        color,
        model,
        warranty,
        size,
      }
      : {
        name,
        description,
        price,
        active,
        image_url: uploadedImageUrls,
        category,
        brand,
        color,
        model,
        warranty,
        size,
      };

    const response = await fetch("/api/product", {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`Erro: ${errorData.error || "Falha ao salvar produto."}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
      return;
    }

    toast.success(`Produto ${isEditMode ? "atualizado" : "criado"} com sucesso!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      transition: Flip,
      theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
    });

    onSubmit({ name, description, price, category, active, brand, color, model, warranty, size, image_url: uploadedImageUrls });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-1">
        <Input name="name" placeholder="Nome do Produto" defaultValue={product?.name} required className="border-2 border-gray-300 dark:border-neutral-500" />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Textarea
          name="description"
          placeholder="Descrição"
          defaultValue={product?.description}
          required
          className="border-2 border-gray-300 dark:border-neutral-500" />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <Input
        name="price"
        type="number"
        step="0.01"
        placeholder="Preço"
        defaultValue={product?.price}
        required className="border-2 border-gray-300 dark:border-neutral-500" />

      <div className="flex flex-col gap-1">
        <Input name="category" placeholder="Categoria" defaultValue={product?.category} required className="border-2 border-gray-300 dark:border-neutral-500" />
        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
      </div>

      {/* Optional fields */}
      <Input name="brand" placeholder="Marca (opcional)" defaultValue={product?.brand || ""} className="border-2 border-gray-300 dark:border-neutral-500" />
      <Input name="color" placeholder="Cor (opcional)" defaultValue={product?.color || ""} className="border-2 border-gray-300 dark:border-neutral-500" />
      <Input name="model" placeholder="Modelo (opcional)" defaultValue={product?.model || ""} className="border-2 border-gray-300 dark:border-neutral-500" />
      <Input name="warranty" placeholder="Garantia (opcional)" defaultValue={product?.warranty || ""} className="border-2 border-gray-300 dark:border-neutral-500" />
      <Input name="size" placeholder="Tamanho (opcional)" defaultValue={product?.size || ""} className="border-2 border-gray-300 dark:border-neutral-500" />

      <div className="flex items-center gap-2">
        <Label htmlFor="active">Ativo</Label>
        <Switch id="active" checked={active} onCheckedChange={setActive} className="cursor-pointer border-2 border-gray-300 dark:border-neutral-500" />
      </div>

      {/* Images upload */}
      <div className="flex flex-col gap-2">
        <Label>Imagens</Label>
        <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="h-auto text-black/60 dark:text-white/50 cursor-pointer max-w-[310px] border-2 border-gray-300 dark:border-neutral-500" />
        {previewUrls.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative w-[120px] h-[120px]">
                <Image src={url} alt={`Pré-visualização ${index}`} fill className="object-contain rounded p-1 border-2 border-gray-300 dark:border-neutral-500" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center cursor-pointer"
                  title="Remover imagem"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" className="cursor-pointer" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="cursor-pointer">
          {isEditMode ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;