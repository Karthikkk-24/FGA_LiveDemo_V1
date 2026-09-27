const SESSION_KEY = 'fga_admin_session_v1'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours

/** Override via VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD in env.example → .env.local */
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'FGAAdmin@2024'

export interface AdminSession {
  username: string
  token: string
  expiresAt: number
}

function timingSafeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length)
  let mismatch = a.length === b.length ? 0 : 1
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return mismatch === 0
}

function createToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `fga_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export function getExpectedAdminUsername(): string {
  return ADMIN_USERNAME
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const userOk = timingSafeEqual(username.trim(), ADMIN_USERNAME)
  const passOk = timingSafeEqual(password, ADMIN_PASSWORD)
  return userOk && passOk
}

export function createAdminSession(username: string): AdminSession {
  const session: AdminSession = {
    username,
    token: createToken(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function readAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AdminSession
    if (!session?.token || !session?.expiresAt || !session?.username) {
      clearAdminSession()
      return null
    }
    if (Date.now() > session.expiresAt) {
      clearAdminSession()
      return null
    }
    return session
  } catch {
    clearAdminSession()
    return null
  }
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAdminAuthenticated(): boolean {
  return readAdminSession() !== null
}
