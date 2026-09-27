import { useLocation, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  clearPreviewDraft,
  readPreviewDraft,
  storePreviewDraft,
  useArticles,
} from '../articleStorage'
import { useAdminAuth } from '../auth/AdminAuthContext'
import { Article } from '../types'
import { ArticlePage } from '../ArticlePage'
import { AdminDashboard } from './AdminDashboard'
import { PostEditor } from './PostEditor'

function AdminDashboardPage() {
  const { articlesList, loading, error, deleteArticle, resetDefaults } = useArticles()
  const { logout, user } = useAdminAuth()
  const navigate = useNavigate()

  return (
    <AdminDashboard
      articles={articlesList}
      loading={loading}
      error={error}
      adminUsername={user?.email || undefined}
      onCreatePost={() => {
        clearPreviewDraft()
        navigate('/admin/editor')
      }}
      onEditPost={(id) => {
        clearPreviewDraft()
        navigate(`/admin/editor/${id}`)
      }}
      onDeletePost={async (id) => {
        try {
          await deleteArticle(id)
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Failed to delete article')
        }
      }}
      onViewPost={(id) => navigate(`/admin/view/${id}`)}
      onBackToSite={() => navigate('/')}
      onResetDefaults={async () => {
        try {
          await resetDefaults()
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Failed to reset defaults')
        }
      }}
      onLogout={async () => {
        await logout()
        navigate('/admin/login', { replace: true })
      }}
    />
  )
}

function AdminEditorPage() {
  const { articleId } = useParams<{ articleId?: string }>()
  const location = useLocation()
  const { articles, loading, saveArticle } = useArticles()
  const navigate = useNavigate()

  const stateDraft = (location.state as { draft?: Article } | null)?.draft
  const storedDraft = readPreviewDraft()
  // Preview → Edit restore: use router state always; use session draft only when it
  // matches this editor target (new post, or same slug). Never let a leftover
  // preview overwrite a different /admin/editor/:id load.
  const draftOverride = (() => {
    if (stateDraft) return stateDraft
    if (!storedDraft) return null
    if (!articleId) return storedDraft
    if (storedDraft.id === articleId) return storedDraft
    return null
  })()

  const articleFromDb = articleId ? articles[articleId] ?? null : null
  const articleToEdit = draftOverride || articleFromDb
  // Preserve original DB id across preview→edit so slug renames still clean up the old row
  const originalId =
    articleFromDb?.id ||
    (draftOverride?.id && articles[draftOverride.id] ? draftOverride.id : undefined)

  if (articleId && loading && !articleToEdit) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#888] flex items-center justify-center font-mono text-sm">
        Loading article…
      </div>
    )
  }

  if (articleId && !loading && !articleToEdit) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-2xl font-semibold">Article not found</h1>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded text-sm font-semibold bg-[#FF3B00] hover:bg-[#e03400] cursor-pointer"
        >
          Back to CMS
        </button>
      </div>
    )
  }

  return (
    <PostEditor
      initialArticle={articleToEdit}
      onSave={async (article) => {
        try {
          await saveArticle(article, { previousId: originalId })
          clearPreviewDraft()
          navigate('/admin')
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Failed to save article')
        }
      }}
      onCancel={() => {
        clearPreviewDraft()
        navigate('/admin')
      }}
      onPreview={(draft) => {
        storePreviewDraft(draft)
        navigate('/admin/preview', { state: { draft } })
      }}
    />
  )
}

function AdminPreviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { articlesList } = useArticles()
  const draft =
    (location.state as { draft?: Article } | null)?.draft || readPreviewDraft()

  if (!draft) {
    return <Navigate to="/admin" replace />
  }

  return (
    <ArticlePage
      article={draft}
      allArticles={articlesList.filter((a) => (a.status || 'published') === 'published')}
      onBackToHome={() => navigate('/admin')}
      onSelectArticle={(id) => navigate(`/admin/view/${id}`)}
      isAdmin
      onEditArticle={() => {
        storePreviewDraft(draft)
        navigate('/admin/editor', { state: { draft } })
      }}
      onOpenAdmin={() => navigate('/admin')}
    />
  )
}

function AdminViewPage() {
  const { articleId } = useParams<{ articleId: string }>()
  const { articles, articlesList, loading } = useArticles()
  const navigate = useNavigate()
  const article = articleId ? articles[articleId] : null

  if (loading && !article) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#888] flex items-center justify-center font-mono text-sm">
        Loading article…
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-2xl font-semibold">Article not found</h1>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 rounded text-sm font-semibold bg-[#FF3B00] hover:bg-[#e03400] cursor-pointer"
        >
          Back to CMS
        </button>
      </div>
    )
  }

  return (
    <ArticlePage
      article={article}
      allArticles={articlesList}
      onBackToHome={() => navigate('/admin')}
      onSelectArticle={(id) => navigate(`/admin/view/${id}`)}
      isAdmin
      onEditArticle={(id) => {
        clearPreviewDraft()
        navigate(`/admin/editor/${id}`)
      }}
      onOpenAdmin={() => navigate('/admin')}
    />
  )
}

export function AdminApp() {
  return (
    <Routes>
      <Route index element={<AdminDashboardPage />} />
      <Route path="posts" element={<Navigate to="/admin" replace />} />
      <Route path="editor" element={<AdminEditorPage />} />
      <Route path="editor/:articleId" element={<AdminEditorPage />} />
      <Route path="preview" element={<AdminPreviewPage />} />
      <Route path="view/:articleId" element={<AdminViewPage />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
