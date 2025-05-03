"use client";

import { Button } from '@/components/ui/button';
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <motion.div
      className="container mx-auto px-4 py-12 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
      <h1 className="text-3xl font-bold mb-4">Pagamento efetuado com sucesso!</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Obrigado por comprar conosco! Seu pedido está sendo processado.
      </p>
      <Link href="/products">
        <Button className="cursor-pointer px-6 py-2 text-white bg-black hover:bg-black/90">
          Continuar comprando
        </Button>
      </Link>
    </motion.div>
  );
}
