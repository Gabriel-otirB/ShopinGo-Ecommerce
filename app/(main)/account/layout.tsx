import ProtectedRoute from '@/components/protected-route';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ShopinGo | Minha Conta",
  description: "Minha Conta",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </>
  )
};