import ProtectedAdminRoute from '@/components/protected-admin-route' 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ShopinGo | Painel Admin",
  description: "Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedAdminRoute>
        {children}
      </ProtectedAdminRoute>
    </>
  )
};