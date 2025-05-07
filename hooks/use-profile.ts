'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/providers/auth-context';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
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
    }

    setLoading(false);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    // Validating updates
    if (!updates.name || updates.name.length < 2) {
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
      .update({ ...updates, updated_at: new Date() })
      .eq('user_id', user.id);

    if (error) {
      setError(error.message);
    } else {
      await fetchProfile();
    }

    setLoading(false);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;

    // Validating new password
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // Check if current password is correct
    const { user: authenticatedUser, error: passwordError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (passwordError) {
      setError('Senha atual incorreta.');
      setLoading(false);
      return;
    }

    // If current password is correct, update password
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
