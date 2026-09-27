import { useLocation, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useArticles } from '../articleStorage'
import { useAdminAuth } from '../auth/AdminAuthContext'
import { Article } from '../types'
import { ArticlePage } from '../ArticlePage'
import { AdminDashboard } from './AdminDashboard'
import { PostEditor } from './PostEditor'

function AdminDashboardPage() {
  const { articlesList, deleteArticle, resetDefaults } = useArticles()
  const { logout, session } = useAdminAuth()
  const navigate = useNavigate()

  return (
    <AdminDashboard
      articles={articlesList}
      adminUsername={session?.username}
      onCreatePost={() => navigate('/admin/editor')}
      onEditPost={(id) => navigate(`/admin/editor/${id}`)}
      onDeletePost={(id) => deleteArticle(id)}
      onViewPost={(id) => navigate(`/article/${id}`)}
      onBackToSite={() => navigate('/')}
      onResetDefaults={resetDefaults}
      onLogout={() => {
        logout()
        navigate('/admin/login', { replace: true })
      }}
    />
  )
}

function AdminEditorPage() {
  const { articleId } = useParams<{ articleId?: string }>()
  const { articles, saveArticle } = useArticles()
  const navigate = useNavigate()
  const articleToEdit = articleId ? articles[articleId] ?? null : null

  return (
    <PostEditor
      initialArticle={articleToEdit}
      onSave={(article) => {
        saveArticle(article)
        navigate('/admin')
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
