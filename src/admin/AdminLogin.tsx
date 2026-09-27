import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '../auth/AdminAuthContext'

export function AdminLogin() {
  const { isAuthenticated, login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from &&
    String((location.state as { from?: string }).from).startsWith('/admin')
      ? (location.state as { from: string }).from
      : '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = login(username, password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-xl p-8"
        style={{
          background: '#161616',
          border: '1px solid #2a2a2a',
          boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-[#FF3B00]/15 border border-[#FF3B00]/30">
            <Shield size={20} className="text-[#FF3B00]" />
          </div>
          <div>
            <p className="font-mono text-[0.7rem] text-[#FF3B00] tracking-wider uppercase">
              Restricted Access
            </p>
            <h1 className="font-display text-xl font-semibold tracking-tight">CMS Studio Login</h1>
          </div>
        </div>

        <p className="text-sm text-[#888] mb-6 leading-relaxed">
          This area is for FGA editors only. There is no public signup — credentials are issued
          privately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#777] uppercase mb-1.5">Username</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#101010] text-sm text-white border border-[#2a2a2a] focus:border-[#FF3B00] outline-none"
              placeholder="Admin username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#777] uppercase mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 rounded bg-[#101010] text-sm text-white border border-[#2a2a2a] focus:border-[#FF3B00] outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/25 rounded px-3 py-2.5">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded font-semibold text-sm text-white bg-[#FF3B00] hover:bg-[#e03400] disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Lock size={15} />
            {submitting ? 'Signing in…' : 'Sign in to CMS'}
          </button>
        </form>
      </div>
    </div>
  )
}
