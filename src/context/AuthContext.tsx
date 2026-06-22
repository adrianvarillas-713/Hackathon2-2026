import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, login as loginRequest } from '../api'
import type { LoginForm, User } from '../types'

type AuthContextValue = {
  user: User | null
  token: string | null
  loading: boolean
  login: (form: LoginForm) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const tokenKey = 'tropelcare_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(tokenKey))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser(token)
        if (active) {
          setUser(currentUser)
        }
      } catch {
        localStorage.removeItem(tokenKey)
        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      active = false
    }
  }, [token])

  async function login(form: LoginForm) {
    const response = await loginRequest(form)
    localStorage.setItem(tokenKey, response.token)
    setToken(response.token)
    setUser(response.user)
  }

  function logout() {
    localStorage.removeItem(tokenKey)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}
