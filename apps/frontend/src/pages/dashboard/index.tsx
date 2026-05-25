import { useQuery } from '@apollo/client/react'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  Plus,
  Wallet,
} from 'lucide-react'
import { createElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GET_CATEGORIES } from '@/graphql/queries/categories'
import { GET_TRANSACTIONS } from '@/graphql/queries/transactions'
import type { Category } from '@/types/category'
import type { Transaction } from '@/types/transaction'
import { getCategoryIcon } from '@/utils/category-icons'
import { getCategoryPalette } from '@/utils/category-palette'
import { TransactionFormDialog } from './transactions/transaction-form-dialog'

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = String(d.getUTCFullYear()).slice(2)
  return `${day}/${month}/${year}`
}

function toPeriodKey(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function DashboardPage() {
  const [formOpen, setFormOpen] = useState(false)
  const navigate = useNavigate()

  const { data: transactionsData } = useQuery<{ transactions: Transaction[] }>(
    GET_TRANSACTIONS,
  )
  const { data: categoriesData } = useQuery<{ categories: Category[] }>(
    GET_CATEGORIES,
  )

  const transactions = transactionsData?.transactions ?? []
  const categories = categoriesData?.categories ?? []
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]))

  const now = new Date()
  const currentPeriod = toPeriodKey(now.toISOString())

  const currentMonthTxs = transactions.filter(
    (t) => toPeriodKey(t.date) === currentPeriod,
  )

  const totalBalance = transactions.reduce(
    (acc, t) => (t.type === 'INCOME' ? acc + t.amount : acc - t.amount),
    0,
  )
  const monthIncome = currentMonthTxs
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0)
  const monthExpense = currentMonthTxs
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + t.amount, 0)

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const categoryStats = categories
    .map((cat) => {
      const catTxs = transactions.filter((t) => t.categoryId === cat.id)
      const total = catTxs.reduce((acc, t) => acc + t.amount, 0)
      return { cat, count: catTxs.length, total }
    })
    .filter((x) => x.count > 0)
    .sort((a, b) => b.total - a.total)

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Saldo total */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="size-4 text-purple-base" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Saldo total
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(totalBalance)}
          </p>
        </div>

        {/* Receitas do mês */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpCircle className="size-4 text-green-base" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Receitas do mês
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(monthIncome)}
          </p>
        </div>

        {/* Despesas do mês */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownCircle className="size-4 text-red-base" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Despesas do mês
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatCurrency(monthExpense)}
          </p>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Transações recentes
            </span>
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-1 text-sm font-medium text-brand-base hover:text-brand-dark transition-colors cursor-pointer"
            >
              Ver todas
              <ChevronRight className="size-4" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-sm">
              Nenhuma transação ainda.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => {
                const category = categoryMap[transaction.categoryId]
                const palette = category
                  ? getCategoryPalette(category.color)
                  : null
                const isIncome = transaction.type === 'INCOME'

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    {/* Icon */}
                    {category && palette ? (
                      <div
                        className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${palette.bg}`}
                      >
                        {createElement(getCategoryIcon(category.icon), {
                          className: `size-4 ${palette.icon}`,
                        })}
                      </div>
                    ) : (
                      <div className="size-9 rounded-lg bg-gray-100 shrink-0" />
                    )}

                    {/* Description + date */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(transaction.date)}
                      </p>
                    </div>

                    {/* Category badge */}
                    {category && palette && (
                      <span
                        className={`hidden sm:inline-flex px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${palette.badge}`}
                      >
                        {category.name}
                      </span>
                    )}

                    {/* Amount + type icon */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-sm font-semibold ${isIncome ? 'text-green-base' : 'text-red-base'}`}
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatCurrency(transaction.amount)}
                      </span>
                      {isIncome ? (
                        <ArrowUpCircle className="size-4 text-green-base" />
                      ) : (
                        <ArrowDownCircle className="size-4 text-red-base" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* New transaction button */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => setFormOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium text-brand-base hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Plus className="size-4" />
              Nova transação
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Categorias
            </span>
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center gap-1 text-sm font-medium text-brand-base hover:text-brand-dark transition-colors cursor-pointer"
            >
              Gerenciar
              <ChevronRight className="size-4" />
            </button>
          </div>

          {categoryStats.length === 0 ? (
            <div className="text-center text-gray-400 py-12 text-sm">
              Nenhuma categoria com transações.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categoryStats.map(({ cat, count, total }) => {
                const palette = getCategoryPalette(cat.color)
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${palette.badge}`}
                    >
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-500 shrink-0">
                      {count} {count === 1 ? 'item' : 'itens'}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 ml-auto">
                      {formatCurrency(total)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <TransactionFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </>
  )
}

export { DashboardPage }
