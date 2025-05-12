'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '@/providers/auth-context'
import ProtectedRoute from '@/components/protected-route'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { signOut } = useAuth()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      toast.error('Erro ao redefinir a senha: ' + updateError.message)
      return
    }

    toast.success('Senha redefinida com sucesso!')
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 dark:bg-neutral-950 rounded-2xl shadow-xl border-2 border-gray-300 dark:border-neutral-500">
          <h1 className="text-2xl font-bold dark:text-blue-400 text-blue-600 text-center mb-6">
            Redefinir Senha
          </h1>

          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Campo: Nova senha */}
            <div className="space-y-2 relative">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Crie uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[31px] text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Campo: Confirmar senha */}
            <div className="space-y-2 relative">
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[31px] text-gray-400 hover:text-gray-200"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-4">
            Recomendação: Anote sua senha e mantenha segura!
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
