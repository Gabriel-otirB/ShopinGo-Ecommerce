'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/providers/auth-context';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'admin' | 'customer';
  updated_at: string | null;
  [key: string]: any;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      setError(error.message);
    } else {
      setProfile(data);
      setError(null);
    }

    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    // Validações
    if (updates.name && updates.name.length < 2) {
      setError('Nome deve ter no mínimo 2 caracteres.');
      return;
    }
    if (updates.phone && updates.phone.length < 10) {
      setError('Telefone inválido.');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (error) {
      setError(error.message);
    } else {
      await fetchProfile();
      setError(null);
    }

    setLoading(false);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // Validate current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      setError('Senha atual incorreta.');
      setLoading(false);
      return;
    }

    // Change password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setError(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, updateProfile, updatePassword, loading, error };
};
