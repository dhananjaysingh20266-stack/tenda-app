import { useEffect, useCallback } from 'react'
import { useWindowVisibility } from './useWindowVisibility'

/**
 * Custom hook for polling login requests with optimized intervals
 * - Polls every 1 minute when window is visible
 * - Immediately polls when window becomes visible after being hidden
 * - Stops polling when window is not visible
 */
export const useLoginRequestsPolling = (
  pollFunction: () => Promise<void> | void,
  isEnabled: boolean = true,
  dependencies: unknown[] = []
) => {
  const isWindowVisible = useWindowVisibility()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const poll = useCallback(pollFunction, dependencies)

  useEffect(() => {
    if (!isEnabled) return

    // Initial poll when enabled or when window becomes visible
    if (isWindowVisible) {
      poll()
    }

    if (!isWindowVisible) return // Don't set up interval if window is not visible

    // Set up 1-minute polling interval
    const interval = setInterval(() => {
      if (isWindowVisible) {
        poll()
      }
    }, 60000) // 1 minute = 60,000ms

    return () => clearInterval(interval)
  }, [isEnabled, isWindowVisible, poll])

  // Poll immediately when window becomes visible
  useEffect(() => {
    if (isEnabled && isWindowVisible) {
      poll()
    }
  }, [isWindowVisible, isEnabled, poll])
}