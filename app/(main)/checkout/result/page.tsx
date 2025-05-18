'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Loading from '@/components/loading';
import { useCartStore } from '@/store/cart-store';
import { supabase } from '@/lib/supabase-client';

export default function CheckoutResultPage() {
  const params = useSearchParams();
  const session_id = params.get('session_id');
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const router = useRouter();
  const { clearCart } = useCartStore();

  useEffect(() => {
    async function fetchStatus() {
      if (!session_id) return;

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setPaymentStatus('unauthorized');
        return;
      }

      const token = data.session.access_token;

      const res = await fetch(`/api/stripe/status?session_id=${session_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await res.json();
      setPaymentStatus(dataResponse.status);

      if (dataResponse.status === 'paid') {
        clearCart();
      }
    }

    fetchStatus();
  }, [session_id, clearCart]);

  if (!session_id && !paymentStatus) redirect('/checkout');
  if (!paymentStatus) return <Loading />;

  return (
    <motion.div
      className="container mx-auto px-4 py-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {paymentStatus === 'paid' && (
        <>
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-4">Pagamento efetuado com sucesso!</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Obrigado por comprar conosco!</p>
          <Button onClick={() => router.push('/products')} className='cursor-pointer'>Continuar comprando</Button>
        </>
      )}

      {paymentStatus === 'canceled' && (
        <>
          <XCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-4">Pagamento falhou!</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Tente novamente ou use outro método de pagamento.</p>
          <Button onClick={() => router.push('/checkout')} className='cursor-pointer'>Tentar novamente</Button>
        </>
      )}

      {paymentStatus === 'unauthorized' && (
        <>
          <XCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-4">Você precisa estar logado para acessar essa página.</h1>
          <Button onClick={() => router.push('/login')} className='cursor-pointer'>Fazer login</Button>
        </>
      )}

      {!['paid', 'canceled', 'unauthorized'].includes(paymentStatus) && (
        <>
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-4">Algo deu errado!</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Não conseguimos processar sua solicitação.</p>
          <Button onClick={() => router.push('/products')} className='cursor-pointer'>Voltar para a loja</Button>
        </>
      )}
    </motion.div>
  );
}
