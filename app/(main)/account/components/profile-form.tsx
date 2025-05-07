'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/providers/auth-context';

const UserProfileForm = () => {
  const { profile, updateProfile, updatePassword, loading, error } = useProfile();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [profile]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await updateProfile({ name: formData.name, phone: formData.phone });

    // Just update password if user is using email provider and new password is provided
    if (isEmailProvider && formData.newPassword) {
      await updatePassword(formData.currentPassword, formData.newPassword);
    }
  };

  // Check if user is using email provider
  const isEmailProvider = user?.app_metadata?.provider === 'email' ||
    user?.identities?.[0]?.provider === 'email';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user?.email} disabled />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Seu nome"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(99) 99999-9999"
        />
      </div>

      {/* Password fields are only shown if user is using email provider */}
      {isEmailProvider && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Digite uma nova senha"
            />
          </div>
        </>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default UserProfileForm;
