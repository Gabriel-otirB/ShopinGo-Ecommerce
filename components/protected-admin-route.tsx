// components/protected-admin-route.tsx
"use client";

import { useAuth } from "../providers/auth-context";
import { useRouter, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from './loading';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (!user.email_confirmed_at) {
        router.push("/auth/verify-email");
      } else if (profile?.role !== "admin") {
        setReady(true); 
      } else {
        setReady(true);
      }
    }
  }, [user, profile, loading, router]);

  if (loading || !ready) return <Loading />;

  if (user && profile?.role !== "admin") {
    notFound();
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
