import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Organization } from '@/types'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  organization: Organization | null
  token: string | null
  setAuth: (user: User, organization: Organization | null, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      organization: null,
      token: null,
      
      setAuth: (user, organization, token) => {
        set({
          isAuthenticated: true,
          user,
          organization,
          token,
        })
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          organization: null,
          token: null,
        })
      },
      
      updateUser: (userData) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        organization: state.organization,
        token: state.token,
      }),
    }
  )
)