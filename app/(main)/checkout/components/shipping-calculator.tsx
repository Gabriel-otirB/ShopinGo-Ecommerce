'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/helper';

type FreightOption = {
  name: string;
  price: number;
  estimatedDays: number;
};

type Props = {
  onSelectFreight: (freight: FreightOption | null) => void;
  onAddressValidityChange?: (isValid: boolean) => void;
};

export default function ShippingCalculator({ onSelectFreight, onAddressValidityChange }: Props) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [freightOptions, setFreightOptions] = useState<FreightOption[] | null>(null);
  const [selectedFreight, setSelectedFreight] = useState<FreightOption | null>(null);

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [errors, setErrors] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const validateAddress = () => {
    const newErrors = {
      street: street ? '' : 'Rua é obrigatória',
      number: number ? '' : 'Número é obrigatório',
      neighborhood: neighborhood ? '' : 'Bairro é obrigatório',
      city: city ? '' : 'Cidade é obrigatória',
      state: state ? '' : 'UF é obrigatória',
    };
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((msg) => msg === '');
    onAddressValidityChange?.(isValid);
    return isValid;
  };

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

      if (data.erro) throw new Error('CEP não encontrado');

      setStreet(data.logradouro || '');
      setNeighborhood(data.bairro || '');
      setCity(data.localidade || '');
      setState(data.uf || '');

      const isSpecialUF = ['SP', 'RJ', 'MG'].includes(data.uf);
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
    if (validateAddress()) {
      setSelectedFreight(option);
      onSelectFreight(option);
    } else {
      setSelectedFreight(null);
      onSelectFreight(null);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 p-4 border rounded shadow-sm bg-white dark:bg-neutral-900 dark:border-neutral-800">
      <h2 className="text-lg font-semibold mb-4">CEP</h2>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
          className="flex-1"
        />
        <Button onClick={handleCalculate} disabled={loading}>
          {loading ? 'Calculando...' : 'Buscar'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>}

      <h2 className="text-lg font-semibold my-4">Endereço</h2>
      <div className="grid grid-cols-1 gap-3 mb-4">
        <div>
          <Input placeholder="Rua" value={street} onChange={(e) => setStreet(e.target.value)} />
          {errors.street && <p className="text-sm text-red-600">{errors.street}</p>}
        </div>
        <div>
          <Input placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} />
          {errors.number && <p className="text-sm text-red-600">{errors.number}</p>}
        </div>
        <div>
          <Input placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
          {errors.neighborhood && <p className="text-sm text-red-600">{errors.neighborhood}</p>}
        </div>
        <div>
          <Input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
          {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
        </div>
        <div>
          <Input placeholder="UF" value={state} onChange={(e) => setState(e.target.value)} maxLength={2} />
          {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
        </div>
        <Input placeholder="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)} />
      </div>

      {freightOptions && (
        <>
          <h2 className="text-lg font-semibold mb-4">Frete</h2>
          <div className="space-y-2 mt-2">
            {freightOptions.map((option) => (
              <div
                key={option.name}
                onClick={() => handleSelectFreight(option)}
                className={`flex justify-between items-center p-2 border rounded text-sm cursor-pointer transition ${
                  selectedFreight?.name === option.name
                    ? 'bg-neutral-100 dark:bg-neutral-800 border-black dark:border-white'
                    : ''
                }`}
              >
                <span>{option.name} (até {option.estimatedDays} dias úteis)</span>
                <span className="font-medium">{formatCurrency(option.price / 100)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
