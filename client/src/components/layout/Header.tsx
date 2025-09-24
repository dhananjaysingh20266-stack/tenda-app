import { LogOut, User as UserIcon, Bell, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { loginRequestsApi } from '@/api'
import LoginApprovalNotification from '@/components/common/LoginApprovalNotification'
import { motion } from 'framer-motion'

const Header = () => {
  const { user, organization } = useAuthStore()
  const logoutMutation = useLogout()
  const [showLoginApprovals, setShowLoginApprovals] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  // Only check for pending requests if user is organization owner/admin
  useEffect(() => {
    if (user?.type === 'organization') {
      const checkPendingRequests = async () => {
        try {
          const response = await loginRequestsApi.getPendingRequests()
          setPendingCount(response.data.length)
        } catch (error) {
          console.error('Failed to fetch pending requests:', error)
        }
      }

      checkPendingRequests()
      // Check every 5 seconds for new requests
      const interval = setInterval(checkPendingRequests, 5000)
      
      return () => clearInterval(interval)
    }
  }, [user?.type])

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-blue-600">Gaming Key Platform</h1>
        {organization && (
          <div className="text-sm text-gray-600">
            {organization.name}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Login Approval Bell - Only for organization users */}
        {user?.type === 'organization' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLoginApprovals(true)}
            className="relative p-2 text-gray-400 hover:text-primary-600 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {pendingCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              >
                {pendingCount}
              </motion.div>
            )}
          </motion.button>
        )}
        
        <div className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            ({user?.type})
          </span>
        </div>
        
        <motion.button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          whileHover={!logoutMutation.isPending ? { scale: 1.05 } : {}}
          whileTap={!logoutMutation.isPending ? { scale: 0.95 } : {}}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {logoutMutation.isPending ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut className="h-4 w-4" />
            </motion.div>
          )}
          <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
        </motion.button>
      </div>

      {/* Login Approval Notification Modal */}
      <LoginApprovalNotification 
        isOpen={showLoginApprovals}
        onClose={() => setShowLoginApprovals(false)}
      />
    </header>
  )
}

export default Header