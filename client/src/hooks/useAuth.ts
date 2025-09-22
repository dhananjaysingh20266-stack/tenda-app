import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import type { LoginForm } from '@/types'
import toast from 'react-hot-toast'

export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: LoginForm) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.organization, response.data.token)
      
      // Only show toast if not handled by interceptor
      if (response.showToast !== false && response.message) {
        toast.success(response.message)
      }
      
      // Redirect based on user type
      if (response.data.user.type === 'organization') {
        navigate('/dashboard')
      } else {
        navigate('/services')
      }
    },
    onError: (error: any) => {
      // Only show toast if not handled by interceptor
      const responseData = error.response?.data
      if (responseData?.showToast === false) {
        return // Don't show toast if explicitly disabled
      }
      if (!responseData?.message && !responseData?.errors) {
        // Fallback message only if no API response
        toast.error('Login failed')
      }
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: (response) => {
      logout()
      navigate('/login')
      
      // Only show toast if not handled by interceptor
      if (response?.showToast !== false && response?.message) {
        toast.success(response.message)
      } else if (!response?.message) {
        // Fallback message
        toast.success('Logged out successfully')
      }
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: {
      email: string
      password: string
      firstName: string
      lastName: string
      organizationName: string
    }) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.organization, response.data.token)
      
      // Only show toast if not handled by interceptor
      if (response.showToast !== false && response.message) {
        toast.success(response.message)
      } else if (!response.message) {
        // Fallback message
        toast.success('Registration successful')
      }
      
      navigate('/dashboard')
    },
    onError: (error: any) => {
      // Only show toast if not handled by interceptor
      const responseData = error.response?.data
      if (responseData?.showToast === false) {
        return // Don't show toast if explicitly disabled
      }
      if (!responseData?.message && !responseData?.errors) {
        // Fallback message only if no API response
        toast.error('Registration failed')
      }
    },
  })
}