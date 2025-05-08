import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  product: { name: string; description: string; price: number; image_url: string[] };
  onSubmit: (data: { name: string; description: string; price: number; image_url: string[] }) => void;
  onClose: () => void;
  isEditMode: boolean;
}

const ProductForm = ({ product, onSubmit, onClose, isEditMode }: ProductFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          name: e.currentTarget.name.value,
          description: e.currentTarget.description.value,
          price: parseFloat(e.currentTarget.price.value),
          image_url: e.currentTarget.image_url.value,
        });
      }}
      className="space-y-4"
    >
      <Input name="name" placeholder="Nome do Produto" defaultValue={product.name} required />
      <Textarea name="description" placeholder="Descrição" defaultValue={product.description} required />
      <Input name="price" type="number" placeholder="Preço" defaultValue={product.price} required />
      <Input name="image_url" placeholder="URL da Imagem" defaultValue={product.image_url} required />

      <div className="flex justify-end space-x-2">
        <Button className="cursor-pointer" type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button className="cursor-pointer" type="submit">{isEditMode ? "Salvar" : "Criar"}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
