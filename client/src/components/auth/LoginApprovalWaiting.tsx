import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { loginRequestsApi } from '@/api'
import { Clock, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface LoginApprovalWaitingProps {
  requestId: number
  onApproved: () => void
  onRejected: (reason?: string) => void
  onExpired: () => void
}

const LoginApprovalWaiting = ({ 
  requestId, 
  onApproved, 
  onRejected, 
  onExpired 
}: LoginApprovalWaitingProps) => {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'expired'>('pending')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [dots, setDots] = useState('.')

  // Check login status every 5 seconds
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await loginRequestsApi.checkLoginStatus(requestId)
        const newStatus = response.data.status
        setStatus(newStatus)

        // Handle status changes
        if (newStatus === 'approved') {
          onApproved()
        } else if (newStatus === 'rejected') {
          onRejected('Login request was denied by the organization')
        } else if (newStatus === 'expired') {
          onExpired()
        }
      } catch (error) {
        console.error('Failed to check login status:', error)
      }
    }

    // Initial check
    checkStatus()

    // Set up polling every 5 seconds
    const statusInterval = setInterval(checkStatus, 5000)

    return () => clearInterval(statusInterval)
  }, [requestId, onApproved, onRejected, onExpired])

  // Update elapsed time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  // Animate dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.'
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />
      case 'expired':
        return <AlertCircle className="h-8 w-8 text-orange-500" />
      default:
        return <Clock className="h-8 w-8 text-blue-500 animate-pulse" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'approved':
        return 'Login approved! Redirecting...'
      case 'rejected':
        return 'Login request was denied'
      case 'expired':
        return 'Login request has expired'
      default:
        return `Waiting for organization approval${dots}`
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return 'text-green-600'
      case 'rejected':
        return 'text-red-600'
      case 'expired':
        return 'text-orange-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <motion.div className="card-elevated p-8 text-center">
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            {getStatusIcon()}
          </motion.div>

          {/* Main Status Message */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-xl font-semibold mb-4 ${getStatusColor()}`}
          >
            {getStatusMessage()}
          </motion.h2>

          {status === 'pending' && (
            <>
              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6 leading-relaxed"
              >
                Your login request has been sent to the organization administrators. 
                They will receive a notification to approve or deny your access.
              </motion.p>

              {/* Security Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Security Check</span>
                </div>
                <p className="text-xs text-blue-700">
                  This additional approval step helps protect your organization's resources 
                  and ensures only authorized members can access services.
                </p>
              </motion.div>

              {/* Time Elapsed */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-500"
              >
                Time elapsed: <span className="font-mono">{formatTime(elapsedTime)}</span>
              </motion.div>

              {/* Loading Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center mt-6"
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {status !== 'pending' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 mt-4"
            >
              {status === 'approved' && 'You will be redirected to the dashboard shortly.'}
              {status === 'rejected' && 'Please contact your organization administrator for assistance.'}
              {status === 'expired' && 'Please try logging in again to send a new request.'}
            </motion.p>
          )}
        </motion.div>

        {/* Auto-refresh note */}
        {status === 'pending' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs text-gray-400 mt-4"
          >
            Status updates automatically every 5 seconds
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

export default LoginApprovalWaiting