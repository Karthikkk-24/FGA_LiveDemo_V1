import { useLocation, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useArticles } from '../articleStorage'
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
      onCreatePost={() => navigate('/admin/editor')}
      onEditPost={(id) => navigate(`/admin/editor/${id}`)}
      onDeletePost={async (id) => {
        try {
          await deleteArticle(id)
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Failed to delete article')
        }
      }}
      onViewPost={(id) => navigate(`/article/${id}`)}
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
  const { articles, loading, saveArticle } = useArticles()
  const navigate = useNavigate()
  const articleToEdit = articleId ? articles[articleId] ?? null : null

  if (loading && articleId) {
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
          await saveArticle(article)
          navigate('/admin')
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Failed to save article')
        }
      }}
      onCancel={() => navigate('/admin')}
      onPreview={(draft) => {
        navigate('/admin/preview', { state: { draft } })
      }}
    />
  )
}

function AdminPreviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { articlesList } = useArticles()
  const draft = (location.state as { draft?: Article } | null)?.draft

  if (!draft) {
    return <Navigate to="/admin" replace />
  }

  return (
    <ArticlePage
      article={draft}
      allArticles={articlesList}
      onBackToHome={() => navigate('/admin')}
      onSelectArticle={(id) => navigate(`/article/${id}`)}
      isAdmin
      onEditArticle={(id) => navigate(`/admin/editor/${id}`)}
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
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
