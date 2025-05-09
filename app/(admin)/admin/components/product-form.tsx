import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { uploadImageToStorage } from "@/lib/upload-image";

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

    let imageUrl = product.image_url?.[0] || "";

    if (selectedFile) {
      const uploadedUrl = await uploadImageToStorage(selectedFile);
      if (!uploadedUrl) {
        alert("Erro ao fazer upload da imagem.");
        return;
      }
      imageUrl = uploadedUrl;
    }

    const priceValue = parseFloat(form.price.value);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("O preço deve ser um número válido maior que zero.");
      return;
    }

    const isUpdate = !!product.stripe_product_id;
    const apiEndpoint = isUpdate ? "/api/update-product" : "/api/create-product";

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stripe_product_id: product.stripe_product_id,
        name: form.name.value,
        description: form.description.value,
        old_price: product.price,
        price: priceValue,
        category: form.category.value,
        active,
        image_url: [imageUrl],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Erro: ${errorData.error || "Falha ao salvar produto."}`);
      return;
    }

    onSubmit({
      name: form.name.value,
      description: form.description.value,
      price: priceValue,
      category: form.category.value,
      active,
      image_url: [imageUrl],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="Nome do Produto" defaultValue={product.name} required />
      <Textarea name="description" placeholder="Descrição" defaultValue={product.description} required />
      <Input name="price" type="number" step="0.01" placeholder="Preço" defaultValue={product.price} required />
      <Input name="category" placeholder="Categoria" defaultValue={product.category} required />

      <div className="flex items-center gap-2">
        <Label htmlFor="active">Ativo</Label>
        <Switch id="active" checked={active} onCheckedChange={setActive} />
      </div>

      <div>
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
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit">{isEditMode ? "Salvar" : "Criar"}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
