"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-context";
import Loading from "@/components/loading";

interface Props {
  children: React.ReactNode;
  orderId: string;
}

export const OrderProvider = ({ children, orderId }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!user) return;

      // Search for the authenticated user's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profile) {
        router.replace("/account");
        return;
      }

      // Search for the order and compare the profile_id
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("profile_id")
        .eq("id", orderId)
        .single();

      if (orderError || !order || order.profile_id !== profile.id) {
        router.replace("/account");
        return;
      }

      setIsAuthorized(true);
      setChecking(false);
    };

    if (!loading && user) {
      checkOwnership();
    }
  }, [user, loading, orderId, router]);

  if (loading || checking) return <Loading />;
  if (!isAuthorized) return null;

  return <>{children}</>;
};
