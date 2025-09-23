import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ServicesPage from '@/pages/services/ServicesPage'
import KeyGenerationPage from '@/pages/services/KeyGenerationPage'
import OrganizationPage from '@/pages/organization/OrganizationPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import AnalyticsPage from '@/pages/analytics/AnalyticsPage'
import MembersPage from '@/pages/members/MembersPage'
import ProtectedRoute from '@/components/common/ProtectedRoute'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to={user?.type === 'organization' ? '/dashboard' : '/services'} /> : 
          <LoginPage />
        } 
      />
      <Route 
        path="/login/organization" 
        element={
          isAuthenticated ? 
          <Navigate to={user?.type === 'organization' ? '/dashboard' : '/services'} /> : 
          <LoginPage />
        } 
      />
      <Route 
        path="/login/individual" 
        element={
          isAuthenticated ? 
          <Navigate to={user?.type === 'organization' ? '/dashboard' : '/services'} /> : 
          <LoginPage />
        } 
      />
      <Route 
        path="/signup" 
        element={
          isAuthenticated ? 
          <Navigate to={user?.type === 'organization' ? '/dashboard' : '/services'} /> : 
          <SignupPage />
        } 
      />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route 
          index 
          element={
            <Navigate to={user?.type === 'organization' ? '/dashboard' : '/services'} />
          } 
        />
        
        {/* Organization Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/users" element={<MembersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Individual User Routes */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/key-generation" element={<KeyGenerationPage />} />
      </Route>
    </Routes>
  )
}

export default App
