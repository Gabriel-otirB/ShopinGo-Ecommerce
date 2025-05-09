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

interface ProductFormProps {
  product: {
    id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    active: boolean;
    image_url: string[];
    stripe_product_id?: string;
    old_price?: number;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    active: boolean;
    image_url: string[];
  }) => void;
  onClose: () => void;
  isEditMode: boolean;
}

const ProductForm = ({ product, onSubmit, onClose, isEditMode }: ProductFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product.image_url?.[0] || null);
  const [active, setActive] = useState<boolean>(product.active ?? true);
  const [errors, setErrors] = useState<{ name?: string; description?: string; category?: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const name = form.name.value.trim();
    const description = form.description.value.trim();
    const price = parseFloat(form.price.value);
    const category = form.category.value.trim();

    // Validação de campos
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

    let imageUrl = product.image_url?.[0] || "";
    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
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
      imageUrl = uploadedUrl;
    }

    const isUpdate = !!product.stripe_product_id;
    const apiEndpoint = isUpdate ? "/api/update-product" : "/api/create-product";

    const body = isUpdate
      ? {
          stripe_product_id: product.stripe_product_id,
          name,
          description,
          old_price: product.price,
          new_price: price,
          category,
          active,
          image_url: [imageUrl],
        }
      : {
          name,
          description,
          price,
          category,
          active,
          image_url: [imageUrl],
        };

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    // TOAST de sucesso
    toast.success(`Produto ${isEditMode ? "atualizado" : "criado"} com sucesso!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      transition: Flip,
      theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
    });

    onSubmit({ name, description, price, category, active, image_url: [imageUrl] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <Input name="name" placeholder="Nome do Produto" defaultValue={product.name} required />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <Textarea name="description" placeholder="Descrição" defaultValue={product.description} required />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <Input name="price" type="number" step="0.01" placeholder="Preço" defaultValue={product.price} required />

      <div className="flex flex-col gap-1">
        <Input name="category" placeholder="Categoria" defaultValue={product.category} required />
        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="active">Ativo</Label>
        <Switch id="active" checked={active} onCheckedChange={setActive} className="cursor-pointer" />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Imagem</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="h-auto text-black/60 dark:text-white/50 cursor-pointer max-w-[310px]"
        />
        {previewUrl && (
          <Image
            src={previewUrl}
            width={120}
            height={120}
            alt="Pré-visualização"
            draggable={false}
            className="mt-2 rounded object-contain border-2 p-2 w-30 h-30"
          />
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
