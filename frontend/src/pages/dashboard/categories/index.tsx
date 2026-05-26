import { useQuery } from '@apollo/client/react'
import { ArrowUpDown, Plus, SquarePen, Tag, Trash } from 'lucide-react'
import { createElement, useState } from 'react'

import { GET_CATEGORIES } from '@/graphql/queries/categories'
import { GET_TRANSACTIONS } from '@/graphql/queries/transactions'
import type { Category } from '@/types/category'
import { getCategoryIcon } from '@/utils/category-icons'
import { getCategoryPalette } from '@/utils/category-palette'

import { CategoryFormDialog } from './category-form-dialog'
import { DeleteCategoryDialog } from './delete-category-dialog'

function CategoryIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return createElement(getCategoryIcon(name), { className })
}

function CategoriesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )

  const { data: categoriesData, loading: loadingCategories } = useQuery<{
    categories: Category[]
  }>(GET_CATEGORIES)
  const { data: transactionsData } = useQuery<{
    transactions: { id: string; categoryId: string }[]
  }>(GET_TRANSACTIONS)

  const categories = categoriesData?.categories ?? []
  const transactions = transactionsData?.transactions ?? []

  const totalTransactions = transactions.length

  const mostUsedCategory = (() => {
    if (!transactions.length || !categories.length) return null
    const counts: Record<string, number> = {}
    for (const t of transactions) {
      counts[t.categoryId] = (counts[t.categoryId] ?? 0) + 1
    }
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return categories.find((c) => c.id === topId) ?? null
  })()

  function getTransactionCount(categoryId: string) {
    return transactions.filter((t) => t.categoryId === categoryId).length
  }

  function handleEdit(category: Category) {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  function handleDelete(category: Category) {
    setSelectedCategory(category)
    setDeleteOpen(true)
  }

  function handleNewCategory() {
    setSelectedCategory(null)
    setFormOpen(true)
  }

  const mostUsedPalette = mostUsedCategory
    ? getCategoryPalette(mostUsedCategory.color)
    : null

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize suas transações por categorias
          </p>
        </div>
        <button
          onClick={handleNewCategory}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-base text-white text-sm font-medium rounded-lg hover:bg-brand-dark transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="size-4" />
          Nova categoria
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total de categorias */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
          <Tag className="size-5 text-gray-700 mt-[6px]" />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {categories.length}
            </p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0.5">
              Total de categorias
            </p>
          </div>
        </div>

        {/* Total de transações */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
          <ArrowUpDown className="size-5 text-purple-base mt-[6px]" />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {totalTransactions}
            </p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0.5">
              Total de transações
            </p>
          </div>
        </div>

        {/* Categoria mais utilizada */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
          {mostUsedCategory && mostUsedPalette ? (
            <CategoryIcon
              name={mostUsedCategory.icon}
              className={`size-5 mt-[6px] ${mostUsedPalette.icon}`}
            />
          ) : (
            <Tag className="size-5 text-gray-400 mt-[6px]" />
          )}
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {mostUsedCategory?.name ?? '—'}
            </p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-0.5">
              Categoria mais utilizada
            </p>
          </div>
        </div>
      </div>

      {loadingCategories ? (
        <div className="text-center text-gray-400 py-16">Carregando...</div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          Nenhuma categoria criada ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const palette = getCategoryPalette(category.color)
            const count = getTransactionCount(category.id)

            return (
              <div
                key={category.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center ${palette.bg}`}
                  >
                    <CategoryIcon
                      name={category.icon}
                      className={`size-5 ${palette.icon}`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(category)}
                      className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-danger hover:bg-red-light transition-colors cursor-pointer"
                    >
                      <Trash className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="size-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <SquarePen className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-gray-800">{category.name}</p>
                  {category.description && (
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${palette.badge}`}
                  >
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-600">
                    {count} {count === 1 ? 'item' : 'itens'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
      />
    </>
  )
}

export { CategoriesPage }
