import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Mail, User } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '@/hooks/use-auth'
import { UPDATE_PROFILE } from '@/graphql/mutations/users'
import { GET_ME } from '@/graphql/queries/me'
import type { User as UserType } from '@/types/user'

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
})

type ProfileFormData = z.infer<typeof profileSchema>

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function ProfilePage() {
  const navigate = useNavigate()
  const { clearToken } = useAuth()

  const { data } = useQuery<{ me: UserType }>(GET_ME)
  const user = data?.me

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (user) {
      reset({ name: user.name })
    }
  }, [user, reset])

  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [GET_ME],
  })

  async function onSubmit(data: ProfileFormData) {
    try {
      await updateProfile({ variables: { input: { name: data.name } } })
      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Ocorreu um erro. Tente novamente.')
    }
  }

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  const initials = user ? getInitials(user.name) : '??'

  return (
    <div className="flex items-start justify-center py-4 sm:py-8">
      <div className="w-full max-w-[448px] bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div className="size-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xl font-semibold text-gray-600">
              {initials}
            </span>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">
              {user?.name ?? '—'}
            </p>
            <p className="text-sm text-gray-500">{user?.email ?? '—'}</p>
          </div>
        </div>

        <div className="w-full border-t border-gray-200" />

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              <input
                {...register('name')}
                type="text"
                placeholder="Seu nome completo"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
              />
            </div>
            {errors.name && (
              <span className="text-xs text-danger">{errors.name.message}</span>
            )}
          </div>

          {/* E-mail (readonly) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={user?.email ?? ''}
                readOnly
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <span className="text-xs text-gray-500">
              O e-mail não pode ser alterado
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !isValid || !isDirty}
            className="w-full py-2.5 text-sm font-semibold text-white bg-brand-base rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <LogOut className="size-4 text-danger" />
          <span className="text-gray-700">Sair da conta</span>
        </button>
      </div>
    </div>
  )
}

export { ProfilePage }
