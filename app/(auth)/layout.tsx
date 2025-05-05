import RedirectIfAuthenticated from '@/components/redirect-if-authenticated';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RedirectIfAuthenticated>
        {children}
      </RedirectIfAuthenticated>
    </>
  )
};