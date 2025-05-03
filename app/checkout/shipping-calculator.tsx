'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/lib/helper';

type FreightOption = {
  name: string;
  price: number;
  estimatedDays: number;
};

type Props = {
  onSelectFreight: (freight: FreightOption | null) => void;
};

export default function ShippingCalculator({ onSelectFreight }: Props) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [freightOptions, setFreightOptions] = useState<FreightOption[] | null>(null);
  const [selectedFreight, setSelectedFreight] = useState<FreightOption | null>(null);
  const [city, setCity] = useState('');

  const handleCalculate = async () => {
    setError('');
    setFreightOptions(null);
    setSelectedFreight(null);
    onSelectFreight(null);

    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setError('CEP inválido');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      setCity(`${data.localidade} - ${data.uf}`);

      const isSpecialUF = ['SP', 'MG', 'RJ'].includes(data.uf);
      const simulatedFreights: FreightOption[] = isSpecialUF
        ? [
            { name: 'PAC', price: 1490, estimatedDays: 5 },
            { name: 'SEDEX', price: 2290, estimatedDays: 2 },
            { name: 'Frete Expresso', price: 3290, estimatedDays: 1 },
          ]
        : [
            { name: 'PAC', price: 1990, estimatedDays: 8 },
            { name: 'SEDEX', price: 2990, estimatedDays: 4 },
            { name: 'Frete Expresso', price: 3990, estimatedDays: 2 },
          ];

      setFreightOptions(simulatedFreights);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar o CEP');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFreight = (option: FreightOption) => {
    setSelectedFreight(option);
    onSelectFreight(option);
  };

  return (
    <div className="max-w-md mx-auto my-6 p-4 border rounded shadow-sm bg-white dark:bg-neutral-900 dark:border-neutral-800">
      <h2 className="text-lg font-semibold mb-4">Calcular Frete</h2>
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Digite seu CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
          className="flex-1"
        />
        <Button onClick={handleCalculate} disabled={loading} className="cursor-pointer">
          {loading ? 'Calculando...' : 'Calcular'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {city && <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Destino: {city}</p>}

      {freightOptions && (
        <div className="space-y-2 mt-2">
          {freightOptions.map((option) => (
            <div
              key={option.name}
              onClick={() => handleSelectFreight(option)}
              className={`flex justify-between items-center p-2 border rounded text-sm cursor-pointer ${
                selectedFreight?.name === option.name
                  ? 'bg-neutral-100 dark:bg-neutral-800 border-black'
                  : ''
              }`}
            >
              <span>{option.name} (até {option.estimatedDays} dias úteis)</span>
              <span className="font-medium">{formatCurrency(option.price / 100)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
