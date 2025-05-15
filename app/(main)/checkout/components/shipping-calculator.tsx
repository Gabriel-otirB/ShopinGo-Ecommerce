'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/helper';
import { useAddress } from '@/hooks/use-address';
import { Address } from '@/types/address';

type FreightOption = {
  name: string;
  price: number;
  estimatedDays: number;
};

type FormData = {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  uf: string;
  complement: string;
  [key: string]: string; // Indice signature to allow dynamic access
};

type Props = {
  onSelectFreight: (freight: FreightOption | null) => void;
  onAddressValidityChange?: (isValid: boolean) => void;
  onFormDataChange: (data: Address) => void;
};

export default function ShippingCalculator({
  onSelectFreight,
  onAddressValidityChange,
  onFormDataChange,
}: Props) {
  const { address, loading: loadingAddress, error: addressError } = useAddress();

  const [formData, setFormData] = useState<FormData>({
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    uf: '',
    complement: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [freightOptions, setFreightOptions] = useState<FreightOption[] | null>(null);
  const [selectedFreight, setSelectedFreight] = useState<FreightOption | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);

  const [isDirty, setIsDirty] = useState(false); // Flag to detect if the form has been changed
  const [hasFreightBeenCalculated, setHasFreightBeenCalculated] = useState(false); // Flag to detect if the freight has been calculated

  // Update form data with supabase data if exists
  useEffect(() => {
    if (address) {
      setFormData(prevFormData => ({
        cep: prevFormData.cep || address.cep,
        street: prevFormData.street || address.street || '',
        number: prevFormData.number || address.number || '',
        neighborhood: prevFormData.neighborhood || address.neighborhood || '',
        city: prevFormData.city || address.city || '',
        uf: prevFormData.uf || address.uf || '',
        complement: prevFormData.complement || address.complement || '',
      }));
    }
  }, [address]);

  // Sends form data to parent
  useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true); // Set the form as changed
    setHasFreightBeenCalculated(false); // When the form changes, force the freight calculation
  };

  const validateAddress = useCallback((setErrorState = true) => {
    const requiredFields = ['street', 'number', 'neighborhood', 'city', 'uf'];
    const newErrors: Record<string, string> = {};

    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = 'Campo obrigatório';
    });

    if (setErrorState) {
      setErrors(newErrors);
    }

    const isValid = Object.keys(newErrors).length === 0;
    setIsAddressValid(isValid);
    onAddressValidityChange?.(isValid);
    return isValid;
  }, [formData, setErrors, setIsAddressValid, onAddressValidityChange]);

  // Validate address on form data change
  useEffect(() => {
    validateAddress(false);
  }, [formData, validateAddress]);

  const handleCalculate = useCallback(async () => {
    if (!validateAddress()) return;

    setError('');
    setFreightOptions(null);
    setSelectedFreight(null);
    onSelectFreight(null);

    const cleanCep = formData.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('CEP inválido');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();

      if (data.erro) throw new Error('CEP não encontrado');

      setFormData(prev => ({
        ...prev,
        street: prev.street || data.logradouro || '',
        neighborhood: prev.neighborhood || data.bairro || '',
        city: prev.city || data.localidade || '',
        uf: prev.uf || data.uf || '',
      }));

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
      setHasFreightBeenCalculated(true); // Checks if the freight has been calculated
    } catch (error) {
      setError('Erro ao buscar o CEP');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [formData, validateAddress, onSelectFreight]);

  const handleSelectFreight = (option: FreightOption) => {
    if (validateAddress()) {
      setSelectedFreight(option);
      onSelectFreight(option);
    } else {
      setSelectedFreight(null);
      onSelectFreight(null);
    }
  };

  useEffect(() => {
    // If the form has been changed and the freight has already been calculated, force a recalculation
    if (isDirty && hasFreightBeenCalculated) {
      handleCalculate();
    }
  }, [isDirty, handleCalculate, hasFreightBeenCalculated]);

  return (
    <div className="max-w-md mx-auto my-6 p-4 border rounded shadow-sm bg-white dark:bg-neutral-900 dark:border-neutral-800">
      <h2 className="text-lg font-semibold mb-4">CEP</h2>
      <div className="flex items-center gap-2 mb-4">
        <Input
          name="cep"
          placeholder="CEP"
          value={formData.cep}
          onChange={handleChange}
          maxLength={9}
          className="flex-1"
        />
        <Button
          className="cursor-pointer"
          onClick={handleCalculate}
          disabled={loading || loadingAddress}>
          {loading || loadingAddress ? 'Calculando...' : 'Buscar'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{error}</p>}
      {addressError && <p className="text-sm text-red-600 dark:text-red-400 mb-2">{addressError}</p>}

      <h2 className="text-lg font-semibold my-4">Endereço</h2>
      <div className="grid grid-cols-1 gap-3 mb-4">
        {[{ name: 'street', placeholder: 'Rua' }, { name: 'number', placeholder: 'Número' }, { name: 'neighborhood', placeholder: 'Bairro' }, { name: 'city', placeholder: 'Cidade' }, { name: 'uf', placeholder: 'UF', maxLength: 2 }, { name: 'complement', placeholder: 'Complemento (opcional)' }].map(({ name, placeholder, maxLength }) => (
          <div key={name}>
            <Input
              name={name}
              placeholder={placeholder}
              value={(formData as Record<string, string>)[name]}
              onChange={handleChange}
              maxLength={maxLength}
            />
            {errors[name] && <p className="text-sm text-red-600">{errors[name]}</p>}
          </div>
        ))}
      </div>

      <Button
        onClick={handleCalculate}
        className="cursor-pointer w-full mb-4"
        disabled={loading || loadingAddress || !isAddressValid}
      >
        {isAddressValid ? 'Calcular frete' : 'Preencha todos os campos'}
      </Button>

      {freightOptions && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Frete</h2>
          <div className="space-y-2 mt-2">
            {freightOptions.map(option => (
              <div
                key={option.name}
                onClick={() => handleSelectFreight(option)}
                className={`flex justify-between items-center p-2 border rounded text-sm cursor-pointer transition ${selectedFreight?.name === option.name
                  ? 'bg-neutral-100 dark:bg-neutral-800 border-black dark:border-white'
                  : ''
                  }`}
              >
                <span>
                  {option.name} (até {option.estimatedDays} dias úteis)
                </span>
                <span className="font-medium">{formatCurrency(option.price / 100)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
