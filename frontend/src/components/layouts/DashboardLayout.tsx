import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Key, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X 
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth'
import toast from 'react-hot-toast'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Gaming Keys', href: '/dashboard/gaming-keys', icon: Key },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, tokens, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      if (tokens?.refreshToken) {
        await authService.logout(tokens.refreshToken)
      }
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      // Even if logout fails, clear local state
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 bg-white shadow-sm">
          <div className="flex items-center h-16 px-4 bg-primary-600">
            <h1 className="text-white text-lg font-semibold">Gaming Key Platform</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName[0]}{user?.lastName[0]}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.organization.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}