import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { GET_CATEGORIES } from '@/graphql/queries/categories'

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open?: boolean
  }) =>
    open ? createElement('div', { 'data-testid': 'dialog' }, children) : null,
  DialogContent: ({ children }: { children: React.ReactNode }) =>
    createElement('div', { 'data-testid': 'dialog-content' }, children),
  DialogHeader: ({ children }: { children: React.ReactNode }) =>
    createElement('div', null, children),
  DialogTitle: ({ children }: { children: React.ReactNode }) =>
    createElement('h2', null, children),
  DialogDescription: ({ children }: { children: React.ReactNode }) =>
    createElement('p', null, children),
}))

import { TransactionFormDialog } from './transaction-form-dialog'

const categoryMock = {
  id: 'cat-1',
  name: 'Alimentação',
  description: '',
  icon: 'utensils',
  color: 'green',
  userId: 'u1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mocks = [
  {
    request: { query: GET_CATEGORIES },
    result: { data: { categories: [categoryMock] } },
  },
  {
    request: { query: GET_CATEGORIES },
    result: { data: { categories: [categoryMock] } },
  },
]

function renderDialog(
  props: Partial<React.ComponentProps<typeof TransactionFormDialog>> = {},
) {
  return render(
    <MockedProvider mocks={mocks}>
      <TransactionFormDialog open={true} onOpenChange={vi.fn()} {...props} />
    </MockedProvider>,
  )
}

describe('TransactionFormDialog', () => {
  it('renders "Nova transação" title when no transaction is passed', () => {
    renderDialog()
    expect(screen.getByText('Nova transação')).toBeInTheDocument()
  })

  it('renders "Editar transação" title when editing', () => {
    renderDialog({
      transaction: {
        id: 'tx-1',
        description: 'Almoço',
        amount: 35,
        type: 'EXPENSE',
        categoryId: 'cat-1',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    expect(screen.getByText('Editar transação')).toBeInTheDocument()
  })

  it('EXPENSE type is selected by default', () => {
    renderDialog()
    const expenseButton = screen.getByRole('button', { name: /despesa/i })
    expect(expenseButton.className).toContain('border-red-base')
  })

  it('switches to INCOME when clicking Receita', () => {
    renderDialog()
    const incomeButton = screen.getByRole('button', { name: /receita/i })
    fireEvent.click(incomeButton)
    expect(incomeButton.className).toContain('border-green-base')
  })

  it('shows amount validation error for negative value', async () => {
    renderDialog()
    const amountInput = screen.getByPlaceholderText('0,00')
    fireEvent.change(amountInput, { target: { value: '-10' } })
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))
    await waitFor(() => {
      expect(screen.getByText('Valor deve ser positivo')).toBeInTheDocument()
    })
  })

  it('loads categories into the select', async () => {
    renderDialog()
    await waitFor(() => {
      expect(screen.getByText('Alimentação')).toBeInTheDocument()
    })
  })
})
