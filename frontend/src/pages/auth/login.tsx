import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Logo } from '@/components/logo'
import { LOGIN_MUTATION } from '@/graphql/mutations/auth'
import { useAuth } from '@/hooks/use-auth'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { saveToken } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const [login, { loading }] = useMutation<{ login: { accessToken: string } }>(
    LOGIN_MUTATION,
  )

  async function onSubmit(data: LoginFormData) {
    try {
      const result = await login({
        variables: { input: { email: data.email, password: data.password } },
      })
      if (result.data?.login.accessToken) {
        saveToken(result.data.login.accessToken)
        navigate('/')
      }
    } catch {
      setError('root', { message: 'E-mail ou senha inválidos' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8 px-4">
      <Logo />

      <div className="bg-white rounded-2xl p-8 w-full max-w-[480px] shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            {errors.password && (
              <span className="text-xs text-danger">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="rounded border-gray-300"
              />
              Lembrar-me
            </label>
            <button
              type="button"
              className="text-sm text-brand-base font-medium hover:text-brand-dark"
            >
              Recuperar senha
            </button>
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-500 mb-3">
          Ainda não tem uma conta?
        </p>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <UserPlus className="size-4" />
          Criar conta
        </button>
      </div>
    </div>
  )
}

export { LoginPage }
