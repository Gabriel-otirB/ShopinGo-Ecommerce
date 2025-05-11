'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const params = useSearchParams();
  const session_id = params.get('session_id');
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session_id) {
      fetch(`/api/stripe/status?session_id=${session_id}`)
        .then(res => res.json())
        .then(data => {
          console.log("Status do pagamento:", data);
          setPaymentStatus(data.status);
        });
    }
  }, [session_id]);

  if (!paymentStatus) return <div className="text-center mt-12">Carregando status do pagamento...</div>;

  return (
    <motion.div
      className="container mx-auto px-4 py-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {paymentStatus === 'paid' ? (
        <>
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-4">Pagamento efetuado com sucesso!</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Obrigado por comprar conosco!</p>
          <Button onClick={() => router.push('/products')}>Continuar comprando</Button>
        </>
      ) : (
        <>
          <CheckCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-4">Pagamento falhou!</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Tente novamente ou use outro método de pagamento.</p>
          <Button onClick={() => router.push('/checkout')}>Tentar novamente</Button>
        </>
      )}
    </motion.div>
  );
}
