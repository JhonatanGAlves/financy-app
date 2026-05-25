import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownCircle, ArrowUpCircle, ChevronDown } from 'lucide-react'
import { useEffect } from 'react'
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
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/graphql/mutations/transactions'
import { GET_CATEGORIES } from '@/graphql/queries/categories'
import { GET_TRANSACTIONS } from '@/graphql/queries/transactions'
import type { Category } from '@/types/category'
import type { Transaction } from '@/types/transaction'

const transactionSchema = z.object({
  description: z.string().max(255).optional(),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().uuid('Selecione uma categoria'),
  date: z.string().min(1, 'Data obrigatória'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
}

function TransactionFormDialog({ open, onOpenChange, transaction }: TransactionFormDialogProps) {
  const isEditing = Boolean(transaction)

  const { data: categoriesData } = useQuery<{ categories: Category[] }>(GET_CATEGORIES)
  const categories = categoriesData?.categories ?? []

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'EXPENSE' },
    mode: 'onChange',
  })

  const selectedType = watch('type')

  useEffect(() => {
    if (open) {
      reset({
        description: transaction?.description ?? '',
        amount: transaction?.amount ?? ('' as unknown as number),
        type: transaction?.type ?? 'EXPENSE',
        categoryId: transaction?.categoryId ?? '',
        date: transaction?.date
          ? new Date(transaction.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      })
    }
  }, [open, transaction, reset])

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  })

  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  })

  const loading = creating || updating

  async function onSubmit(data: TransactionFormData) {
    try {
      if (isEditing && transaction) {
        await updateTransaction({
          variables: {
            input: {
              id: transaction.id,
              description: data.description,
              amount: data.amount,
              type: data.type,
              categoryId: data.categoryId,
              date: new Date(data.date).toISOString(),
            },
          },
        })
        toast.success('Transação atualizada com sucesso!')
      } else {
        await createTransaction({
          variables: {
            input: {
              description: data.description,
              amount: data.amount,
              type: data.type,
              categoryId: data.categoryId,
              date: new Date(data.date).toISOString(),
            },
          },
        })
        toast.success('Transação criada com sucesso!')
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
          <DialogTitle>{isEditing ? 'Editar transação' : 'Nova transação'}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Registre sua despesa ou receita
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
          <input type="hidden" {...register('type')} />

          {/* Tipo toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('type', 'EXPENSE', { shouldValidate: true })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors cursor-pointer ${
                selectedType === 'EXPENSE'
                  ? 'border-red-base text-red-base bg-red-light'
                  : 'border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <ArrowDownCircle className="size-5" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'INCOME', { shouldValidate: true })}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors cursor-pointer ${
                selectedType === 'INCOME'
                  ? 'border-green-base text-green-base bg-green-light'
                  : 'border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <ArrowUpCircle className="size-5" />
              Receita
            </button>
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <input
              {...register('description')}
              type="text"
              placeholder="Ex. Almoço no restaurante"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
            />
            {errors.description && (
              <span className="text-xs text-danger">{errors.description.message}</span>
            )}
          </div>

          {/* Data + Valor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Data</label>
              <input
                {...register('date')}
                type="date"
                placeholder="Selecione"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 text-gray-700 cursor-pointer"
              />
              {errors.date && (
                <span className="text-xs text-danger">{errors.date.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">R$</span>
                <input
                  {...register('amount')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
                />
              </div>
              {errors.amount && (
                <span className="text-xs text-danger">{errors.amount.message}</span>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <div className="relative">
              <select
                {...register('categoryId')}
                className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 text-gray-700 bg-white cursor-pointer"
              >
                <option value="" disabled>Selecione</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.categoryId && (
              <span className="text-xs text-danger">{errors.categoryId.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full py-2.5 text-sm font-semibold text-white bg-brand-base rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { TransactionFormDialog }
