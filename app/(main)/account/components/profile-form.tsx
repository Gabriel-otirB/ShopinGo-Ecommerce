"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useAuth } from "@/providers/auth-context";
import { Bounce, Flip, toast } from 'react-toastify';

const UserProfileForm = () => {
  const { profile, updateProfile, updatePassword, loading, error } = useProfile();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const errors = {
      name: "",
      phone: "",
      currentPassword: "",
      newPassword: "",
    };

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "O nome deve ter pelo menos 2 caracteres.";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits.match(/^(\d{10,11})$/)) {
      errors.phone = "Digite um telefone válido com DDD.";
    }

    if (isEmailProvider && formData.newPassword) {
      if (formData.newPassword.length < 6) {
        errors.newPassword = "A nova senha deve ter no mínimo 6 caracteres.";
      }

      if (!formData.currentPassword) {
        errors.currentPassword = "Digite a senha atual.";
      }
    }

    setFieldErrors(errors);

    return Object.values(errors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      toast.success(`Perfil atualizado com sucesso!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        transition: Flip,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    } catch (error) {
      toast.error("Erro ao atualizar perfil.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }

    try {
      if (isEmailProvider && formData.newPassword) {
        await updatePassword(formData.currentPassword, formData.newPassword);
        toast.success(`Senha atualizada com sucesso!`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Flip,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        });
      }
    } catch (error) {
      toast.error("Erro ao atualizar senha.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }

  };

  const isEmailProvider =
    user?.app_metadata?.provider === "email" ||
    user?.identities?.[0]?.provider === "email";

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
        {fieldErrors.name && (
          <p className="text-sm text-red-500">{fieldErrors.name}</p>
        )}
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
        {fieldErrors.phone && (
          <p className="text-sm text-red-500">{fieldErrors.phone}</p>
        )}
      </div>

      {isEmailProvider && (
        <>
          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-[31px] text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {fieldErrors.currentPassword && (
              <p className="text-sm text-red-500">{fieldErrors.currentPassword}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Digite uma nova senha"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[31px] text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {fieldErrors.newPassword && (
              <p className="text-sm text-red-500">{fieldErrors.newPassword}</p>
            )}
          </div>
        </>
      )}

      <Button type="submit" disabled={loading} className="w-full cursor-pointer">
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default UserProfileForm;
