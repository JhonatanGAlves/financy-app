import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { CategoriesPage } from '@/pages/dashboard/categories'
import { DashboardLayout } from '@/pages/dashboard/layout'
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
        <Route
          path="/"
          element={<div className="text-gray-800">Dashboard (em breve)</div>}
        />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export { App }
