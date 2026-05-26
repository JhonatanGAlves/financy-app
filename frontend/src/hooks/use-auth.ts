import { createContext, useContext } from 'react'

import type { AuthContextValue } from '@/types/auth'

export const TOKEN_KEY = 'financy:token'

export const AuthContext = createContext<AuthContextValue | null>(null)

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export { useAuth }
