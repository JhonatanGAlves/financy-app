import { useQuery } from '@apollo/client/react'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SquarePen,
  Trash,
} from 'lucide-react'
import { createElement, useState } from 'react'

import { GET_CATEGORIES } from '@/graphql/queries/categories'
import { GET_TRANSACTIONS } from '@/graphql/queries/transactions'
import type { Category } from '@/types/category'
import type { Transaction } from '@/types/transaction'
import { getCategoryIcon } from '@/utils/category-icons'
import { getCategoryPalette } from '@/utils/category-palette'

import { DeleteTransactionDialog } from './delete-transaction-dialog'
import { TransactionFormDialog } from './transaction-form-dialog'

const PAGE_SIZE = 10

const PT_MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

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

function periodLabel(key: string) {
  const [year, month] = key.split('-')
  return `${PT_MONTHS[Number(month) - 1]} / ${year}`
}

function TransactionsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [period, setPeriod] = useState(() => toPeriodKey(new Date().toISOString()))
  const [page, setPage] = useState(1)

  const { data: transactionsData, loading } = useQuery<{ transactions: Transaction[] }>(GET_TRANSACTIONS)
  const { data: categoriesData } = useQuery<{ categories: Category[] }>(GET_CATEGORIES)

  const transactions = transactionsData?.transactions ?? []
  const categories = categoriesData?.categories ?? []
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]))

  // Available periods from transactions
  const periods = [...new Set(transactions.map((t) => toPeriodKey(t.date)))].sort().reverse()
  if (!periods.includes(period)) periods.unshift(period)

  // Filtered + sorted
  const filtered = transactions
    .filter((t) => {
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false
      if (categoryFilter && t.categoryId !== categoryFilter) return false
      if (toPeriodKey(t.date) !== period) return false
      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleEdit(transaction: Transaction) {
    setSelectedTransaction(transaction)
    setFormOpen(true)
  }

  function handleDelete(transaction: Transaction) {
    setSelectedTransaction(transaction)
    setDeleteOpen(true)
  }

  function handleNew() {
    setSelectedTransaction(null)
    setFormOpen(true)
  }

  function handleFilter(fn: () => void) {
    fn()
    setPage(1)
  }

  const startItem = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const endItem = Math.min(page * PAGE_SIZE, filtered.length)

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie todas as suas transações financeiras</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-base text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4" />
          Nova transação
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição"
                value={search}
                onChange={(e) => handleFilter(() => setSearch(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">Tipo</label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => handleFilter(() => setTypeFilter(e.target.value))}
                className="w-full appearance-none pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 text-gray-700 bg-white cursor-pointer"
              >
                <option value="ALL">Todos</option>
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">Categoria</label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => handleFilter(() => setCategoryFilter(e.target.value))}
                className="w-full appearance-none pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 text-gray-700 bg-white cursor-pointer"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Period */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-700">Período</label>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => handleFilter(() => setPeriod(e.target.value))}
                className="w-full appearance-none pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-base focus:ring-2 focus:ring-brand-base/20 text-gray-700 bg-white cursor-pointer"
              >
                {periods.map((p) => (
                  <option key={p} value={p}>{periodLabel(p)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-400 py-16">Carregando...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-16">Nenhuma transação encontrada.</div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-700 uppercase tracking-wide">Descrição</th>
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-700 uppercase tracking-wide">Data</th>
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-700 uppercase tracking-wide">Categoria</th>
                      <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-700 uppercase tracking-wide">Tipo</th>
                      <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-700 uppercase tracking-wide">Valor</th>
                      <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-700 uppercase tracking-wide">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((transaction) => {
                      const category = categoryMap[transaction.categoryId]
                      const palette = category ? getCategoryPalette(category.color) : null
                      const isIncome = transaction.type === 'INCOME'

                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {category && palette ? (
                                <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${palette.bg}`}>
                                  {createElement(getCategoryIcon(category.icon), {
                                    className: `size-4 ${palette.icon}`,
                                  })}
                                </div>
                              ) : (
                                <div className="size-8 rounded-lg bg-gray-100 shrink-0" />
                              )}
                              <span className="font-medium text-gray-800">{transaction.description}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600">{formatDate(transaction.date)}</td>
                          <td className="px-5 py-4">
                            {category && palette ? (
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${palette.badge}`}>
                                {category.name}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className={`flex items-center gap-1.5 text-sm font-medium ${isIncome ? 'text-green-base' : 'text-red-base'}`}>
                              {isIncome
                                ? <ArrowUpCircle className="size-4" />
                                : <ArrowDownCircle className="size-4" />}
                              {isIncome ? 'Entrada' : 'Saída'}
                            </div>
                          </td>
                          <td className={`px-5 py-4 text-right font-semibold ${isIncome ? 'text-green-base' : 'text-red-base'}`}>
                            {isIncome ? '+ ' : '- '}{formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleDelete(transaction)}
                                className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-danger hover:bg-red-light transition-colors cursor-pointer"
                              >
                                <Trash className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <SquarePen className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="sm:hidden divide-y divide-gray-100">
                {paginated.map((transaction) => {
                  const category = categoryMap[transaction.categoryId]
                  const palette = category ? getCategoryPalette(category.color) : null
                  const isIncome = transaction.type === 'INCOME'

                  return (
                    <div key={transaction.id} className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {category && palette ? (
                          <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${palette.bg}`}>
                            {createElement(getCategoryIcon(category.icon), {
                              className: `size-4 ${palette.icon}`,
                            })}
                          </div>
                        ) : (
                          <div className="size-8 rounded-lg bg-gray-100 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                            {category && palette && (
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${palette.badge}`}>
                                {category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-sm font-semibold ${isIncome ? 'text-green-base' : 'text-red-base'}`}>
                          {isIncome ? '+ ' : '- '}{formatCurrency(transaction.amount)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(transaction)}
                            className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-danger hover:bg-red-light transition-colors cursor-pointer"
                          >
                            <Trash className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <SquarePen className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {startItem} a {endItem} | {filtered.length} resultados
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="size-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((item, idx) =>
                      item === 'ellipsis' ? (
                        <span key={`e-${idx}`} className="size-8 flex items-center justify-center text-sm text-gray-400">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          className={`size-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            page === item
                              ? 'bg-brand-base text-white'
                              : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {item}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={selectedTransaction}
      />

      <DeleteTransactionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        transaction={selectedTransaction}
      />
    </>
  )
}

export { TransactionsPage }
