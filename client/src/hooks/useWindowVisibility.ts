import { useState, useEffect } from 'react'

/**
 * Hook to detect when the window/tab becomes visible or hidden
 * Returns true when window is visible (focused), false when hidden
 */
export const useWindowVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    // Add event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Add event listener for window focus/blur as fallback
    const handleFocus = () => setIsVisible(true)
    const handleBlur = () => setIsVisible(false)
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return isVisible
}