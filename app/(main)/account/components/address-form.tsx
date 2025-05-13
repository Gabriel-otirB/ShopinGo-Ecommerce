import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddress } from '@/hooks/use-address';
import { useEffect, useState } from 'react';
import { Bounce, Flip, toast } from 'react-toastify';

const AddressForm = () => {
  const { address, saveAddress, loading, error } = useAddress();
  const [formData, setFormData] = useState({
    cep: "",
    city: "",
    uf: "",
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
  });

  useEffect(() => {
    if (address) {
      setFormData({
        cep: address.cep,
        city: address.city,
        uf: address.uf,
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        complement: address.complement || "",
      });
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveAddress(formData);
      toast.success(`Endereço salvo com sucesso!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        transition: Flip,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    } catch (error) {
      toast.error("Erro ao salvar endereço.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" name="cep" placeholder="00000-000" value={formData.cep} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" placeholder="Ex: São Paulo" value={formData.city} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="uf">Estado (UF)</Label>
          <Input id="uf" name="uf" placeholder="Ex: SP" maxLength={2} value={formData.uf} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="street">Rua</Label>
          <Input id="street" name="street" placeholder="Nome da rua" value={formData.street} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="number">Número</Label>
          <Input id="number" name="number" placeholder="123" value={formData.number} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" name="neighborhood" placeholder="Nome do bairro" value={formData.neighborhood} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" name="complement" placeholder="Apto, bloco, etc." value={formData.complement} onChange={handleChange} />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full cursor-pointer">
        {loading ? "Salvando..." : "Salvar Endereço"}
      </Button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default AddressForm;
