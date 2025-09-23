import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import LoginApprovalWaiting from '@/components/auth/LoginApprovalWaiting'
import toast from 'react-hot-toast'

const LoginWaitingPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  
  const requestId = location.state?.requestId

  // Redirect if already authenticated or no request ID
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/services')
      return
    }
    
    if (!requestId) {
      navigate('/login/individual')
      return
    }
  }, [isAuthenticated, requestId, navigate])

  const handleApproved = () => {
    // In a real application, we might receive user data and token
    // For now, redirect to login to complete the process
    toast.success('Login approved! Please log in again to complete the process.')
    navigate('/login/individual')
  }

  const handleRejected = (reason?: string) => {
    toast.error(reason || 'Login request was denied')
    navigate('/login/individual')
  }

  const handleExpired = () => {
    toast.error('Login request has expired. Please try again.')
    navigate('/login/individual')
  }

  if (!requestId) {
    return null // Will redirect via useEffect
  }

  return (
    <LoginApprovalWaiting
      requestId={requestId}
      onApproved={handleApproved}
      onRejected={handleRejected}
      onExpired={handleExpired}
    />
  )
}

export default LoginWaitingPage