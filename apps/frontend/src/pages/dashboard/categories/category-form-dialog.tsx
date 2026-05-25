import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { createElement, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/mutations/categories'
import { GET_CATEGORIES } from '@/graphql/queries/categories'
import type { Category } from '@/types/category'
import { COLOR_NAMES, getCategoryPalette } from '@/utils/category-palette'
import { getCategoryIcon, ICON_NAMES } from '@/utils/category-icons'

const DEFAULT_ICON = 'briefcase-business'
const DEFAULT_COLOR = 'green'

const categorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(100),
  description: z.string().max(255).optional(),
  icon: z.string().min(1),
  color: z.string().min(1),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEditing = Boolean(category)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { icon: DEFAULT_ICON, color: DEFAULT_COLOR },
  })

  const selectedIcon = watch('icon')
  const selectedColor = watch('color')

  useEffect(() => {
    if (open) {
      reset({
        name: category?.name ?? '',
        description: category?.description ?? '',
        icon: category?.icon ?? DEFAULT_ICON,
        color: category?.color ?? DEFAULT_COLOR,
      })
    }
  }, [open, category, reset])

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [GET_CATEGORIES],
  })

  const loading = creating || updating

  async function onSubmit(data: CategoryFormData) {
    try {
      if (isEditing && category) {
        await updateCategory({
          variables: {
            input: {
              id: category.id,
              name: data.name,
              description: data.description || undefined,
              icon: data.icon,
              color: data.color,
            },
          },
        })
        toast.success('Categoria atualizada com sucesso!')
      } else {
        await createCategory({
          variables: {
            input: {
              name: data.name,
              description: data.description || undefined,
              icon: data.icon,
              color: data.color,
            },
          },
        })
        toast.success('Categoria criada com sucesso!')
      }
      onOpenChange(false)
    } catch {
      toast.error('Ocorreu um erro. Tente novamente.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="w-[448px] max-w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
          <input type="hidden" {...register('icon')} />
          <input type="hidden" {...register('color')} />

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Ex: Alimentação"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
            />
            {errors.name && (
              <span className="text-xs text-danger">{errors.name.message}</span>
            )}
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Descrição <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Ex: Gastos com restaurantes e delivery"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Ícone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Ícone</label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_NAMES.map((iconName) => {
                const selected = selectedIcon === iconName
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setValue('icon', iconName, { shouldValidate: true })}
                    className={`size-9 flex items-center justify-center rounded-lg border transition-colors ${
                      selected
                        ? 'border-brand-base bg-brand-base/10 text-brand-base'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {createElement(getCategoryIcon(iconName), { className: 'size-4' })}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Cor</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_NAMES.map((colorName) => {
                const palette = getCategoryPalette(colorName)
                const selected = selectedColor === colorName
                return (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() => setValue('color', colorName, { shouldValidate: true })}
                    className={`w-[50px] h-[30px] rounded-lg transition-all flex items-center justify-center p-1 ${
                      selected
                        ? `border-2 ${palette.selectedBorder}`
                        : 'border border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-full rounded-[4px] ${palette.swatch}`} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-white bg-brand-base rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CategoryFormDialog }
