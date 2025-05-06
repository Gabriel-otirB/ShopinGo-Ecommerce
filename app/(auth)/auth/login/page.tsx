"use client";

import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase-client";
import { useAuth } from '@/providers/auth-context';
import RedirectIfAuthenticated from '@/components/redirect-if-authenticated';

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const { signInWithGoogle } = useAuth();


  const validateName = (name: string) => {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(name)) return setNameError("Apenas letras e espaços");
    if (name.length < 2) return setNameError("Mínimo de 2 letras");
    if (name.length > 100) return setNameError("Máximo de 100 letras");
    setNameError("");
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePasswords = (password: string, confirm: string) => password === confirm;

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;
    const confirm = form.confirm.value;

    validateName(form.name.value);
    setEmailError(validateEmail(email) ? "" : "Email inválido");
    setPasswordError(password.length >= 6 ? "" : "Mínimo de 6 caracteres");
    setConfirmPasswordError(validatePasswords(password, confirm) ? "" : "As senhas não coincidem");

    if (emailError || passwordError || confirmPasswordError || nameError) return;

    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) return console.error("Erro ao criar conta:", signUpError);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return console.error("Erro ao logar:", signInError);

    router.push(redirectTo);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return console.error("Erro ao entrar:", error);

    router.push(redirectTo);
  };

  return (
    <RedirectIfAuthenticated>
      <div className="flex flex-col items-center justify-center px-4 gap-4 -mt-4">
        <Card className="w-full max-w-md border-2 border-gray-300 dark:border-neutral-500">
          <CardHeader>
            <CardTitle
              className="text-2xl font-bold text-gray-800 dark:text-white hover:text-blue-600
             dark:hover:text-blue-400 transition-colors cursor-pointer mx-auto">
              ShopinGo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full h-full dark:bg-neutral-950 border-2 border-gray-300 dark:border-neutral-500">
                <TabsTrigger value="login" className="cursor-pointer">Login</TabsTrigger>
                <TabsTrigger value="signup" className="cursor-pointer">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="seuemail@email.com" />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[31px] text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full cursor-pointer">Entrar</Button>
                  <p className="text-center text-sm mt-2">
                    Não tem uma conta?
                    <span onClick={() => setActiveTab("signup")} className="ml-1 underline cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600">
                      Crie agora
                    </span>
                  </p>
                </form>

                <Separator className="my-6" />
                <Button variant="outline" className="w-full cursor-pointer" onClick={() => signInWithGoogle(redirectTo)}>
                  Entrar com Google
                </Button>
              </TabsContent>

              <TabsContent value="signup">
                <form className="space-y-4" onSubmit={handleSignUp}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" placeholder="Seu nome completo" required />
                    {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha segura"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[31px] text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="confirm">Confirmar Senha</Label>
                    <Input
                      id="confirm"
                      name="confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita a senha"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-[31px] text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
                  </div>

                  <Button type="submit" className="w-full cursor-pointer">Criar Conta</Button>
                </form>

                <Separator className="my-6" />

                <Button variant="outline" className="w-full cursor-pointer" onClick={() => signInWithGoogle(redirectTo)}>
                  Criar com Google
                </Button>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RedirectIfAuthenticated>
  );
};

export default Login;
