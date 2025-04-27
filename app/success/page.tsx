"use client";

import { Button } from '@/components/ui/button';
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Pagamento efetuado com sucesso!</h1>
      <p className="mb-4">
        Obrigado por comprar conosco! Seu pedido está sendo processado.
      </p>
      <Link href="/products" className="text-blue-600 hover:underline">
        <Button className='cursor-pointer'>Continuar comprando</Button>
      </Link>
    </div>
  );
}
