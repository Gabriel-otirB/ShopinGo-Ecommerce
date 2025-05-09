"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-context";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import RedirectIfAuthenticated from '@/components/redirect-if-authenticated';

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleResendEmail = async () => {
    if (!user?.email) return;

    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    });

    if (error) {
      setStatus("error");
      setMessage("Erro ao reenviar o e-mail. Tente novamente.");
    } else {
      setStatus("success");
      setMessage("E-mail de verificação reenviado com sucesso!");
    }
  };

  return (
    <RedirectIfAuthenticated>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-600px)] text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Verifique seu e-mail</h1>
        <p className="mb-6 max-w-md text-gray-600 dark:text-gray-300">
          Um link de verificação foi enviado para <strong>{user?.email}</strong>.
          Você precisa confirmá-lo para continuar usando o ShopinGo.
        </p>

        <Button
          onClick={handleResendEmail}
          disabled={status === "loading"}
          className="cursor-pointer"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} /> Enviando...
            </>
          ) : (
            "Reenviar e-mail de verificação"
          )}
        </Button>

        {status === "success" && (
          <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm">
            <CheckCircle2 size={18} className="mr-1" />
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 flex items-center text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={18} className="mr-1" />
            {message}
          </div>
        )}
      </div>
    </RedirectIfAuthenticated>
  );
}
