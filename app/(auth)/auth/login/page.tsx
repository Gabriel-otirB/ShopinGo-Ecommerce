"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bounce, Flip, toast } from "react-toastify";

import { useAuth } from '@/providers/auth-context';
import RedirectIfAuthenticated from '@/components/redirect-if-authenticated';
import { supabase } from '@/lib/supabase-client';

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");

  // Erros do Login
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Erros do Signup
  const [signupNameError, setSignupNameError] = useState("");
  const [signupEmailError, setSignupEmailError] = useState("");
  const [signupPasswordError, setSignupPasswordError] = useState("");
  const [signupConfirmPasswordError, setSignupConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirm = form.confirm.value;

    const nameValid = /^[A-Za-z\s]+$/.test(name) && name.length >= 2 && name.length <= 100;
    const emailValid = validateEmail(email);
    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirm;

    setSignupNameError(nameValid ? "" : "Nome inválido");
    setSignupEmailError(emailValid ? "" : "Email inválido");
    setSignupPasswordError(passwordValid ? "" : "Mínimo de 6 caracteres");
    setSignupConfirmPasswordError(passwordsMatch ? "" : "As senhas não coincidem");

    if (!nameValid || !emailValid || !passwordValid || !passwordsMatch) return;

    try {
      await signUp(email, password, name);

      toast.success("Conta criada! Verifique seu email.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Flip,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });

      router.push("/auth/verify-email");
    } catch (error: any) {
      toast.error("Erro ao criar conta.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value;

    const emailValid = validateEmail(email);
    const passwordValid = password.length >= 6;

    setLoginEmailError(emailValid ? "" : "Email inválido");
    setLoginPasswordError(passwordValid ? "" : "Mínimo de 6 caracteres");
    setShowResetPassword(false);

    if (!emailValid || !passwordValid) return;

    try {
      await signIn(email, password);
      router.push(redirectTo);
    } catch (error: any) {
      const message = error?.message || "Erro ao fazer login";
      if (message.toLowerCase().includes("invalid") || message.toLowerCase().includes("credenciais")) {
        setLoginPasswordError("Email ou senha incorretos");
        setShowResetPassword(true);
      } else {
        setLoginPasswordError(message);
      }

      toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }
  };

  const handleResetPassword = async () => {
    const emailInput = document.getElementById("login-email") as HTMLInputElement;
    const email = emailInput?.value.trim();

    if (!validateEmail(email)) {
      toast.error("Informe um email válido para redefinir a senha.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    });

    if (error) {
      toast.error("Erro ao enviar email de redefinição.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    } else {
      toast.success("Email de redefinição enviado!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        transition: Flip,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }
  };

  return (
    <RedirectIfAuthenticated>
      <div className="flex flex-col items-center justify-center px-4 gap-4">
        <Card className="w-full max-w-md border-2 border-gray-300 dark:border-neutral-500">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
              ShopinGo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full h-full dark:bg-neutral-950 border-2 border-gray-300 dark:border-neutral-500">
                <TabsTrigger value="login" className="cursor-pointer">Login</TabsTrigger>
                <TabsTrigger value="signup" className="cursor-pointer">Criar Conta</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" name="email" type="email" placeholder="seuemail@email.com" />
                    {loginEmailError && <p className="text-sm text-red-500">{loginEmailError}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
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
                    {loginPasswordError && <p className="text-sm text-red-500">{loginPasswordError}</p>}
                    {showResetPassword && (
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className="text-sm dark:text-blue-400 text-blue-600 hover:underline mt-1 cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>

                  <Button type="submit" className="w-full cursor-pointer">Entrar</Button>
                </form>

                <Separator className="my-6" />
                <Button variant="outline" className="w-full flex items-center gap-2 cursor-pointer" onClick={() => signInWithGoogle(redirectTo)}>
                  <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34-4.3-50.2H272v95h146.9c-6.3 33.6-25.2 62-53.7 81.1v67h86.9c50.8-46.8 81.4-115.7 81.4-192.9z" />
                    <path fill="#34A853" d="M272 544.3c72.6 0 133.7-24.1 178.3-65.4l-86.9-67c-24.1 16.2-55 25.7-91.4 25.7-70.3 0-129.9-47.5-151.2-111.5h-89v69.9C77.8 486.6 168.9 544.3 272 544.3z" />
                    <path fill="#FBBC05" d="M120.8 326.1c-9.6-28.6-9.6-59.8 0-88.4v-69.9h-89c-39.3 78.5-39.3 170.3 0 248.7l89-69.9z" />
                    <path fill="#EA4335" d="M272 107.7c39.5-.6 77.4 13.9 106.4 39.7l79.4-79.4C417.5 24.7 346.8-0.8 272 0 168.9 0 77.8 57.7 31.8 144.3l89 69.9C142.1 155.2 201.7 107.7 272 107.7z" />
                  </svg>
                  Entrar com Google
                </Button>
              </TabsContent>

              {/* SIGNUP */}
              <TabsContent value="signup">
                <form className="space-y-4" onSubmit={handleSignUp}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" name="name" placeholder="Seu nome completo" required />
                    {signupNameError && <p className="text-sm text-red-500">{signupNameError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="seu@email.com" required />
                    {signupEmailError && <p className="text-sm text-red-500">{signupEmailError}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
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
                    {signupPasswordError && <p className="text-sm text-red-500">{signupPasswordError}</p>}
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
                      className="absolute right-3 top-[31px] text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {signupConfirmPasswordError && <p className="text-sm text-red-500">{signupConfirmPasswordError}</p>}
                  </div>

                  <Button type="submit" className="w-full cursor-pointer">Criar Conta</Button>
                </form>

                <Separator className="my-6" />
                <Button variant="outline" className="w-full flex items-center gap-2 cursor-pointer" onClick={() => signInWithGoogle(redirectTo)}>
                  <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.5-34-4.3-50.2H272v95h146.9c-6.3 33.6-25.2 62-53.7 81.1v67h86.9c50.8-46.8 81.4-115.7 81.4-192.9z" />
                    <path fill="#34A853" d="M272 544.3c72.6 0 133.7-24.1 178.3-65.4l-86.9-67c-24.1 16.2-55 25.7-91.4 25.7-70.3 0-129.9-47.5-151.2-111.5h-89v69.9C77.8 486.6 168.9 544.3 272 544.3z" />
                    <path fill="#FBBC05" d="M120.8 326.1c-9.6-28.6-9.6-59.8 0-88.4v-69.9h-89c-39.3 78.5-39.3 170.3 0 248.7l89-69.9z" />
                    <path fill="#EA4335" d="M272 107.7c39.5-.6 77.4 13.9 106.4 39.7l79.4-79.4C417.5 24.7 346.8-0.8 272 0 168.9 0 77.8 57.7 31.8 144.3l89 69.9C142.1 155.2 201.7 107.7 272 107.7z" />
                  </svg>
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




