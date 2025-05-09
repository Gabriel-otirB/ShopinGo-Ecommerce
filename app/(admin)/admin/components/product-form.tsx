import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from 'next/image';

interface ProductFormProps {
  product: {
    name: string;
    description: string;
    price: number;
    category: string;
    active: boolean;
    image_url: string[];
  };
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    active: boolean;
    image_url: string[]; // URLs após o upload
  }) => void;
  onClose: () => void;
  isEditMode: boolean;
}

const ProductForm = ({ product, onSubmit, onClose, isEditMode }: ProductFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product.image_url?.[0] || null);

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
    const imageUrls: string[] = [];

    // Se houver imagem selecionada, você deve fazer o upload aqui
    if (selectedFile) {
      // Exemplo: upload para Supabase Storage, Cloudinary, etc.
      // const uploadedUrl = await uploadImage(selectedFile);
      // imageUrls.push(uploadedUrl);

      // Placeholder para fins de teste local
      imageUrls.push(previewUrl || "");
    } else {
      imageUrls.push(...product.image_url);
    }

    onSubmit({
      name: form.name.value,
      description: form.description.value,
      price: parseFloat(form.price.value),
      category: form.category.value,
      active: form.active.checked,
      image_url: imageUrls,
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
        <Switch id="active" name="active" defaultChecked={product.active} />
      </div>

      <div>
        <div className="flex flex-col gap-y-2">
          <Label>Imagem</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="h-auto dark:text-white/50 text-black/60 cursor-pointer max-w-[310px]"
          />
        </div>
        {previewUrl && (
          <Image
            src={previewUrl}
            width={120}
            height={120}
            alt="Pré-visualização"
            draggable={false}
            className="mt-2 rounded object-contain border-gray-300 dark:border-neutral-500 border-2 w-30 h-30 p-2" />
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">Cancelar</Button>
        <Button type="submit" className="cursor-pointer">{isEditMode ? "Salvar" : "Criar"}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
