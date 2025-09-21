import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedBackgroundProps {
  className?: string
  variant?: 'login' | 'dashboard' | 'minimal'
}

const AnimatedBackground = ({ className = '', variant = 'login' }: AnimatedBackgroundProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; size: number }>>([])

  useEffect(() => {
    // Generate random particles for the particle system
    const particleCount = variant === 'login' ? 15 : 8
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 15, // Random delay up to 15s
      size: Math.random() * 4 + 2, // Random size between 2-6
    }))
    setParticles(newParticles)
  }, [variant])

  if (variant === 'minimal') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        {/* Simple gradient orbs for minimal variant */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 blur-3xl animate-pulse-glow"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-accent-400 to-accent-600 blur-3xl animate-pulse-glow"
        />
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Enhanced Background decorative elements */}
      
      {/* Main gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 blur-3xl animate-pulse-glow gpu-accelerated"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-accent-400 to-accent-600 blur-3xl animate-pulse-glow gpu-accelerated"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-primary-300 to-accent-300 blur-3xl animate-pulse-glow gpu-accelerated"
      />

      {/* Floating geometric shapes */}
      <motion.div
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 0.1, rotate: 0 }}
        transition={{ duration: 3, delay: 1.5 }}
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-blue-600/20 rounded-2xl blur-sm animate-float-slow gpu-accelerated contain-layout"
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 2.5, delay: 2 }}
        className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-primary-600/20 rounded-full animate-float-medium gpu-accelerated contain-layout"
      />

      <motion.div
        initial={{ opacity: 0, rotate: 180 }}
        animate={{ opacity: 0.08, rotate: 0 }}
        transition={{ duration: 4, delay: 2.5 }}
        className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-bl from-primary-400/20 to-accent-400/20 animate-float-fast gpu-accelerated contain-layout"
        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
      />

      {/* Gaming-themed hexagon pattern */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 3, delay: 3 }}
        className="absolute top-1/4 left-1/4 w-40 h-40 border border-primary-400/30 animate-hexagon-spin gpu-accelerated"
        style={{ 
          clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
          background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)'
        }}
      />

      {/* Morphing mesh gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ duration: 4, delay: 1 }}
        className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-primary-500/10 via-blue-400/10 to-accent-500/10 animate-mesh-morph blur-xl gpu-accelerated"
      />

      {/* Wave flow elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: 0.1 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
          className="absolute top-1/3 w-full h-2 bg-gradient-to-r from-transparent via-primary-400/20 to-transparent skew-y-2 gpu-accelerated"
        />
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: '-100%', opacity: 0.08 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'loop', ease: 'linear', delay: 5 }}
          className="absolute bottom-1/3 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -skew-y-1 gpu-accelerated"
        />
      </div>

      {/* Particle system */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            scale: 0,
            opacity: 0
          }}
          animate={{
            y: -20,
            x: Math.random() * window.innerWidth,
            scale: [0, 1, 1, 0],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: particle.delay
          }}
          className="absolute pointer-events-none gpu-accelerated"
        >
          <div 
            className="rounded-full bg-gradient-to-r from-primary-400/40 to-blue-500/40 blur-sm"
            style={{ 
              width: particle.size,
              height: particle.size,
              boxShadow: `0 0 ${particle.size * 2}px rgba(59, 130, 246, 0.3)`
            }}
          />
        </motion.div>
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] animate-grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-blue-50/20 pointer-events-none" />
      
      {/* Corner accent lights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 3, delay: 2 }}
        className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-3xl animate-pulse-glow gpu-accelerated"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 3, delay: 3 }}
        className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-2xl animate-pulse-glow gpu-accelerated"
      />
    </div>
  )
}

export default AnimatedBackground