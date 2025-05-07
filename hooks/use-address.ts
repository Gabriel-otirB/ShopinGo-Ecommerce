"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-context";

interface Address {
  id?: number;
  cep: string;
  city: string;
  uf: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAddress = () => {
  const { user } = useAuth();
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async () => {
    if (!user) {
      console.log("Nenhum usuário logado.");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Buscando profile para user id:", user.id);

    // Search Profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Erro ao buscar profile:", profileError);
      setError(profileError.message);
      setLoading(false);
      return;
    }

    console.log("Profile retornado:", profile);

    if (!profile.address_id) {
      console.log("Profile não possui address_id.");
      setAddress(null);
      setLoading(false);
      return;
    }

    console.log("Buscando endereço para address_id:", profile.address_id);

    // Search Address
    const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", profile.address_id)
      .single();

    if (addressError) {
      console.error("Erro ao buscar endereço:", addressError);
      setError(addressError.message);
    } else {
      console.log("Endereço encontrado:", addressData);
      setAddress(addressData);
    }

    setLoading(false);
  };

  const validateAddress = (addr: Address) => {
    if (
      !addr.cep ||
      !addr.city ||
      !addr.uf ||
      !addr.street ||
      !addr.number ||
      !addr.neighborhood
    ) {
      return "Preencha todos os campos obrigatórios.";
    }
    return null;
  };

  const saveAddress = async (newAddress: Address) => {
    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }

    const validationError = validateAddress(newAddress);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    // Search Current Profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("address_id")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    if (profile?.address_id) {
      // Update Existing Address
      const { error: updateError } = await supabase
        .from("addresses")
        .update({ ...newAddress, updated_at: new Date() })
        .eq("id", profile.address_id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      // Create New Address
      const { data: insertData, error: insertError } = await supabase
        .from("addresses")
        .insert({ ...newAddress })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      // Update Profile with new address_id
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ address_id: insertData.id })
        .eq("user_id", user.id);

      if (profileUpdateError) {
        setError(profileUpdateError.message);
        setLoading(false);
        return;
      }
    }

    await fetchAddress();
    setLoading(false);
  };

  useEffect(() => {
    fetchAddress();
  }, [user]);

  return { address, saveAddress, loading, error };
};
