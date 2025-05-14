import ProtectedRoute from '@/components/protected-route';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ShopinGo | Carrinho",
  description: "Meu carrinho",
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </>
  )
};