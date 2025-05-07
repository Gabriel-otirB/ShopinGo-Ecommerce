import RedirectIfAuthenticated from '@/components/redirect-if-authenticated';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RedirectIfAuthenticated>
        {children}
      </RedirectIfAuthenticated>
    </>
  )
};