import { useMutation } from '@apollo/client/react'
import toast from 'react-hot-toast'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DELETE_TRANSACTION } from '@/graphql/mutations/transactions'
import { GET_TRANSACTIONS } from '@/graphql/queries/transactions'
import type { Transaction } from '@/types/transaction'

interface DeleteTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

function DeleteTransactionDialog({ open, onOpenChange, transaction }: DeleteTransactionDialogProps) {
  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  })

  async function handleConfirm() {
    if (!transaction) return
    try {
      await deleteTransaction({ variables: { id: transaction.id } })
      toast.success('Transação excluída com sucesso!')
      onOpenChange(false)
    } catch {
      toast.error('Erro ao excluir transação. Tente novamente.')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>{transaction?.description}</strong>?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-danger text-white hover:bg-red-dark cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteTransactionDialog }
