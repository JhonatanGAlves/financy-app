import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, LogIn, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Logo } from '@/components/logo'
import { REGISTER_MUTATION } from '@/graphql/mutations/auth'
import { useAuth } from '@/hooks/use-auth'

const registerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(100),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { saveToken } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  const [registerMutation, { loading }] = useMutation<{
    register: { accessToken: string }
  }>(REGISTER_MUTATION)

  async function onSubmit(data: RegisterFormData) {
    try {
      const result = await registerMutation({ variables: { input: data } })
      if (result.data?.register.accessToken) {
        saveToken(result.data.register.accessToken)
        navigate('/')
      }
    } catch {
      setError('root', { message: 'Erro ao criar conta. Tente novamente.' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 px-4">
      <Logo />

      <div className="bg-white rounded-2xl p-8 w-full max-w-[480px] shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-1">
            Comece a controlar suas finanças ainda hoje
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                {...register('name')}
                type="text"
                placeholder="Seu nome completo"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
              />
            </div>
            {errors.name && (
              <span className="text-xs text-danger">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="mail@exemplo.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-danger">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <span className="text-xs text-gray-400">
              A senha deve ter no mínimo 8 caracteres
            </span>
            {errors.password && (
              <span className="text-xs text-danger">
                {errors.password.message}
              </span>
            )}
          </div>

          {errors.root && (
            <span className="text-xs text-danger text-center">
              {errors.root.message}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-base text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-500 mb-3">
          Já tem uma conta?
        </p>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogIn className="size-4" />
          Fazer login
        </button>
      </div>
    </div>
  )
}

export { RegisterPage }
