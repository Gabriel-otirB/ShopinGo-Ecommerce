'use client';

import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CancelPage() {
  const router = useRouter();

  return (
    <motion.div
      className="container mx-auto px-4 py-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <XCircle className="mx-auto text-red-500 mb-4" size={64} />
      <h1 className="text-3xl font-bold mb-4">Pagamento cancelado!</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Você pode tentar novamente a qualquer momento.</p>
      <Button onClick={() => router.push('/products')}>Voltar aos produtos</Button>
    </motion.div>
  );
}
