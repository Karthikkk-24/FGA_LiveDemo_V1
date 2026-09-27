import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearAdminSession,
  createAdminSession,
  readAdminSession,
  validateAdminCredentials,
  type AdminSession,
} from './adminAuth'

interface AdminAuthContextValue {
  session: AdminSession | null
  isAuthenticated: boolean
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string }
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => readAdminSession())

  const login = useCallback((username: string, password: string) => {
    if (!username.trim() || !password) {
      return { ok: false as const, error: 'Enter username and password.' }
    }
    if (!validateAdminCredentials(username, password)) {
      return { ok: false as const, error: 'Invalid username or password.' }
    }
    const next = createAdminSession(username.trim())
    setSession(next)
    return { ok: true as const }
  }, [])

  const logout = useCallback(() => {
    clearAdminSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
      login,
      logout,
    }),
    [session, login, logout]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return ctx
}
