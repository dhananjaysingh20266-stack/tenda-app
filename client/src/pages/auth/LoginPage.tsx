import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLogin } from '@/hooks/useAuth'
import type { LoginForm as LoginFormType } from '@/types'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import AnimatedBackground from '@/components/ui/AnimatedBackground'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  loginType: z.enum(['organization', 'individual']),
})

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isIndividual, setIsIndividual] = useState(false) // false = organization, true = individual
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const location = useLocation()

  // Set login type based on current route
  useEffect(() => {
    const path = location.pathname
    if (path === '/login/individual') {
      setIsIndividual(true)
    } else {
      setIsIndividual(false)
    }
  }, [location.pathname])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginType: 'organization',
    },
  })

  // Update form value and route when toggle changes
  const handleToggle = () => {
    const newValue = !isIndividual
    setIsIndividual(newValue)
    const loginType = newValue ? 'individual' : 'organization'
    setValue('loginType', loginType)
    
    // Update route without page reload
    const newPath = newValue ? '/login/individual' : '/login/organization'
    navigate(newPath, { replace: true })
  }

  // Set initial form value based on current state
  useEffect(() => {
    const loginType = isIndividual ? 'individual' : 'organization'
    setValue('loginType', loginType)
  }, [isIndividual, setValue])

  const onSubmit = (data: LoginFormType) => {
    loginMutation.mutate(data)
  }

  // Dynamic description based on selection
  const getDescription = () => {
    return isIndividual 
      ? "Access services as a member"
      : "Manage your organization and members"
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <AnimatedBackground variant="login" className="z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 mb-6 relative overflow-hidden group"
          >
            <Sparkles className="h-6 w-6 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in to <span className="text-primary-600 font-semibold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Gaming Key Platform</span>
          </p>

          {/* Modern Toggle Switch - Moved to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <ToggleSwitch
              isOn={isIndividual}
              onToggle={handleToggle}
              leftLabel="Organization"
              rightLabel="Individual"
              className="mb-4"
            />
            
            {/* Dynamic Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={isIndividual ? 'individual' : 'organization'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-gray-600 font-medium"
              >
                {getDescription()}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card glass-effect p-8 shadow-strong bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 relative overflow-hidden group"
        >
          {/* Enhanced glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-50/20 to-transparent opacity-50" />
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit(onSubmit)}>
            {/* Hidden input for loginType - controlled by toggle */}
            <input type="hidden" {...register('loginType')} />
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    className="input focus:ring-primary-500/30 focus:border-primary-500 focus:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative"
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input pr-10 focus:ring-primary-500/30 focus:border-primary-500 focus:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm"
                    placeholder="Enter your password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </motion.button>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px -8px rgba(59, 130, 246, 0.4)",
                  background: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)"
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loginMutation.isPending}
                className="btn-primary w-full relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
                
                <span className="absolute left-0 inset-y-0 flex items-center pl-3 relative z-10">
                  <LogIn className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                </span>
                <span className="pl-6 relative z-10">
                  {loginMutation.isPending ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center"
                    >
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </motion.span>
                  ) : (
                    'Sign in'
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoginPage