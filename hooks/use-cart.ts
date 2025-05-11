// hooks/useCart.ts
"use client";

import { useRef } from "react";
import { createUserCartStore } from "@/stores/cart-store";
import { useAuth } from "@/contexts/AuthProvider";

export const useCart = () => {
  const { user } = useAuth();
  const storeRef = useRef<ReturnType<typeof createUserCartStore>>();

  if (!user) {
    throw new Error("useCart: Usuário não autenticado");
  }

  // Cria a store só uma vez por sessão de usuário
  if (!storeRef.current) {
    storeRef.current = createUserCartStore(user.id);
  }

  return storeRef.current;
};
