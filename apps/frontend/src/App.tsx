import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { CategoriesPage } from '@/pages/dashboard/categories'
import { DashboardPage } from '@/pages/dashboard'
import { DashboardLayout } from '@/pages/dashboard/layout'
import { ProfilePage } from '@/pages/dashboard/profile'
import { TransactionsPage } from '@/pages/dashboard/transactions'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        }
      />
      <Route
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export { App }
