"use client";

import { useAuth } from "../providers/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from './loading';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (!user.email_confirmed_at) {
        router.push("/auth/verify-email");
      }
    }
  }, [user, loading, router]);
  

  if (loading) return <Loading />;
  if (!user) return <Loading />;
  if (user === null) return <Loading />;

  return <>{children}</>;
};

export default ProtectedRoute;
