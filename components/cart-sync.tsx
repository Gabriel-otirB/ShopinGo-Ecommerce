"use client";

import { useEffect } from "react";
import { useCartStore } from '@/store/cart-store';
import { useAuth } from "@/providers/auth-context";

export default function CartSync() {
  const { user } = useAuth();
  const setUserId = useCartStore((state) => state.setUserId);

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    } else {
      setUserId(null);
    }
  }, [user, setUserId]);

  return null;
}
