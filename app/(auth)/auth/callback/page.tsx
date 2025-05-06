"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-context";
import Loading from "@/components/loading";

const AuthCallbackPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("redirectTo");
    if (encoded) {
      setRedirectTo(decodeURIComponent(encoded));
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  return <Loading />;
};

export default AuthCallbackPage;
