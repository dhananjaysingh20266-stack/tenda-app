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
      toast.success('Login successful')
      
      // Redirect based on user type
      if (response.data.user.type === 'organization') {
        navigate('/dashboard')
      } else {
        navigate('/services')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout()
      navigate('/login')
      toast.success('Logged out successfully')
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
      toast.success('Registration successful')
      navigate('/dashboard')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
    },
  })
}