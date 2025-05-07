import ProtectedAdminRoute from '@/components/protected-admin-route' 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedAdminRoute>
        {children}
      </ProtectedAdminRoute>
    </>
  )
};