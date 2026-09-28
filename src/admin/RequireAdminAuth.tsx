import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAdminAuth } from '../auth/AdminAuthContext'

/** Blocks unauthenticated access to the admin CMS. Uses Supabase Auth session. */
export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#888] flex items-center justify-center font-mono text-sm">
        Checking session…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
