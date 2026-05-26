import { Navigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export { AuthGuard }
