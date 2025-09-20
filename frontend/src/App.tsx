import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { OverviewPage } from '@/pages/OverviewPage'
import { UsersPage } from '@/pages/UsersPage'
import { GamingKeysPage } from '@/pages/GamingKeysPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'

function App() {
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } 
        />
        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<OverviewPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/gaming-keys" element={<GamingKeysPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </div>
  )
}

export default App