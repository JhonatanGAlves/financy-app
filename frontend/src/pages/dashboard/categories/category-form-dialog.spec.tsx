import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { CREATE_CATEGORY } from '@/graphql/mutations/categories'
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

import { CategoryFormDialog } from './category-form-dialog'

const mocks = [
  {
    request: {
      query: CREATE_CATEGORY,
      variables: {
        input: {
          name: 'Alimentação',
          description: undefined,
          icon: 'briefcase-business',
          color: 'green',
        },
      },
    },
    result: {
      data: {
        createCategory: {
          id: '1',
          name: 'Alimentação',
          description: null,
          icon: 'briefcase-business',
          color: 'green',
          userId: 'u1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  {
    request: { query: GET_CATEGORIES },
    result: { data: { categories: [] } },
  },
]

function renderDialog(
  props: Partial<React.ComponentProps<typeof CategoryFormDialog>> = {},
) {
  return render(
    <MockedProvider mocks={mocks}>
      <CategoryFormDialog open={true} onOpenChange={vi.fn()} {...props} />
    </MockedProvider>,
  )
}

describe('CategoryFormDialog', () => {
  it('renders "Nova categoria" title when no category is passed', () => {
    renderDialog()
    expect(screen.getByText('Nova categoria')).toBeInTheDocument()
  })

  it('renders "Editar categoria" title when editing', () => {
    renderDialog({
      category: {
        id: '1',
        name: 'Alimentação',
        description: '',
        icon: 'utensils',
        color: 'green',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    expect(screen.getByText('Editar categoria')).toBeInTheDocument()
  })

  it('pre-fills form fields when editing', () => {
    renderDialog({
      category: {
        id: '1',
        name: 'Viagens',
        description: 'Gastos com viagens',
        icon: 'briefcase-business',
        color: 'blue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    expect(screen.getByDisplayValue('Viagens')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Gastos com viagens')).toBeInTheDocument()
  })

  it('shows validation error when name is empty on submit', async () => {
    renderDialog()
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))
    await waitFor(() => {
      expect(screen.getByText('Nome obrigatório')).toBeInTheDocument()
    })
  })

  it('calls onOpenChange(false) after successful create', async () => {
    const onOpenChange = vi.fn()
    renderDialog({ onOpenChange })

    fireEvent.change(screen.getByPlaceholderText('Ex: Alimentação'), {
      target: { value: 'Alimentação' },
    })
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
