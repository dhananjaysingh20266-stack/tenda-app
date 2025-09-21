import { Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar userType={user?.type} />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout