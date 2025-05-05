"use client";

import { useAuth } from '@/providers/auth-context'; 
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, router, loading]);

  if (loading) return <div>Carregando...</div>;
  if (user) return null;

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
