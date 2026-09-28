import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AdminAuthProvider } from './auth/AdminAuthContext'
import { ArticlesProvider } from './articleStorage'
import { TaxonomyProvider } from './taxonomyStorage'
import { AdminLogin } from './admin/AdminLogin'
import { RequireAdminAuth } from './admin/RequireAdminAuth'
import { HomePage, PublicArticlePage } from './PublicSite'

const AdminApp = lazy(() =>
  import('./admin/AdminApp').then((m) => ({ default: m.AdminApp }))
)

function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return undefined
  return base.replace(/\/$/, '')
}

/** Migrates legacy hash article links; strips legacy #admin hashes on the public site. */
function LegacyHashRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const articleMatch = hash.match(/^#(article|breakdown|post)\/(.+)$/)
    if (articleMatch) {
      navigate(`/article/${articleMatch[2]}`, { replace: true })
      return
    }

    // Never honor #admin* on the public surface — clear it quietly
    if (hash.startsWith('#admin')) {
      window.history.replaceState(null, '', location.pathname + location.search)
    }
  }, [navigate, location.pathname, location.search])

  return null
}

function AdminChunkFallback() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#888] flex items-center justify-center font-mono text-sm">
      Loading CMS…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <AdminAuthProvider>
        <ArticlesProvider>
          <TaxonomyProvider>
          <LegacyHashRedirect />
          <Routes>
            {/* Public site — no login, no admin chrome */}
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:articleId" element={<PublicArticlePage />} />

            {/* Dedicated admin login (unauthenticated) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected CMS — lazy-loaded so public users never mount this UI */}
            <Route
              path="/admin/*"
              element={
                <RequireAdminAuth>
                  <Suspense fallback={<AdminChunkFallback />}>
                    <AdminApp />
                  </Suspense>
                </RequireAdminAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </TaxonomyProvider>
        </ArticlesProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}
