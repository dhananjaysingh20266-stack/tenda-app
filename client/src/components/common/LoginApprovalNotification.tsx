import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loginRequestsApi } from '@/api'
import type { LoginRequest } from '@/types'
import { Bell, UserCheck, UserX, Clock, User as UserIcon, Monitor } from 'lucide-react'
import { useLoginRequestsPolling } from '@/hooks/useLoginRequestsPolling'
import toast from 'react-hot-toast'

interface ExtendedLoginRequest extends LoginRequest {
  user?: {
    id: number
    email: string
    firstName: string
    lastName: string
  }
  organization?: {
    id: number
    name: string
  }
}

interface LoginApprovalNotificationProps {
  isOpen: boolean
  onClose: () => void
}

const LoginApprovalNotification = ({ isOpen, onClose }: LoginApprovalNotificationProps) => {
  const [loginRequests, setLoginRequests] = useState<ExtendedLoginRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null)

  // Fetch pending login requests
  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await loginRequestsApi.getPendingRequests()
      setLoginRequests(response.data as ExtendedLoginRequest[])
    } catch {
      console.error('Failed to fetch pending requests')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Use optimized polling - every 1 minute and when window becomes visible
  useLoginRequestsPolling(fetchPendingRequests, isOpen, [])

  const handleApprove = async (requestId: number) => {
    try {
      setProcessingRequestId(requestId)
      await loginRequestsApi.approveLoginRequest(requestId)
      toast.success('Login request approved!')
      fetchPendingRequests() // Refresh list
    } catch {
      toast.error('Failed to approve login request')
    } finally {
      setProcessingRequestId(null)
    }
  }

  const handleReject = async (requestId: number) => {
    try {
      setProcessingRequestId(requestId)
      await loginRequestsApi.rejectLoginRequest(requestId, 'Access denied by organization')
      toast.success('Login request rejected!')
      fetchPendingRequests() // Refresh list
    } catch {
      toast.error('Failed to reject login request')
    } finally {
      setProcessingRequestId(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Login Approval Requests</h3>
                    <p className="text-sm text-gray-600">
                      {loginRequests.length} pending request{loginRequests.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Loading requests...</span>
                </div>
              ) : loginRequests.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h4>
                  <p className="text-gray-500">All login requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loginRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                              <UserIcon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {request.user ? `${request.user.firstName} ${request.user.lastName}` : `User ID: ${request.userId}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {request.user?.email || `User ID: ${request.userId}`}
                              </p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimeAgo(request.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-11 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Monitor className="h-3 w-3 mr-2" />
                              IP: {request.ipAddress}
                            </div>
                            <div className="text-xs">
                              User-Agent: {request.userAgent.substring(0, 60)}...
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(request.id)}
                            disabled={processingRequestId === request.id}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Allow
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(request.id)}
                            disabled={processingRequestId === request.id}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                          >
                            <UserX className="h-3 w-3 mr-1" />
                            Deny
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Auto-refreshes every 1 minute • Click outside to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginApprovalNotification