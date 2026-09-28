import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ARTICLES } from './data'
import { articleToRow, rowToArticle, supabase, type ArticleRow } from './lib/supabase'
import type { Article } from './types'

function rowsToMap(rows: ArticleRow[]): Record<string, Article> {
  const map: Record<string, Article> = {}
  for (const row of rows) {
    map[row.id] = rowToArticle(row)
  }
  return map
}

export type SaveArticleOptions = {
  /** Previous slug/id when editing — used to delete the old row after a rename */
  previousId?: string
}

type ArticlesContextValue = {
  articles: Record<string, Article>
  articlesList: Article[]
  loading: boolean
  error: string | null
  getArticle: (id: string) => Article | null
  saveArticle: (article: Article, options?: SaveArticleOptions) => Promise<Article>
  deleteArticle: (articleId: string) => Promise<void>
  resetDefaults: () => Promise<void>
  refresh: () => Promise<void>
}

const ArticlesContext = createContext<ArticlesContextValue | null>(null)

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Record<string, Article>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedOnceRef = useRef(false)

  const refresh = useCallback(async () => {
    setError(null)
    if (!hasLoadedOnceRef.current) setLoading(true)

    const { data, error: fetchError } = await supabase
      .from('articles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (fetchError) {
      console.error('Failed to load articles from Supabase:', fetchError)
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setArticles(rowsToMap((data || []) as ArticleRow[]))
    setLoading(false)
    hasLoadedOnceRef.current = true
  }, [])

  useEffect(() => {
    void refresh()

    const channel = supabase
      .channel('articles-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        () => {
          void refresh()
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [refresh])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh()
    })
    return () => subscription.unsubscribe()
  }, [refresh])

  const saveArticle = useCallback(
    async (article: Article, options?: SaveArticleOptions): Promise<Article> => {
      const previousId = options?.previousId
      const nextId = article.id.trim()
      if (!nextId) {
        throw new Error('Slug / URL identifier is required.')
      }

      const { data: existing, error: existingError } = await supabase
        .from('articles')
        .select('id')
        .eq('id', nextId)
        .maybeSingle()

      if (existingError) {
        throw new Error(existingError.message)
      }

      if (existing && existing.id !== previousId) {
        throw new Error(
          `Slug "${nextId}" is already used by another post. Choose a different URL identifier.`
        )
      }

      const payload = articleToRow({
        ...article,
        id: nextId,
        status: article.status || 'published',
      })

      const { data, error: upsertError } = await supabase
        .from('articles')
        .upsert(payload, { onConflict: 'id' })
        .select('*')
        .single()

      if (upsertError) {
        console.error('Failed to save article:', upsertError)
        throw new Error(upsertError.message)
      }

      if (previousId && previousId !== nextId) {
        const { error: deleteOldError } = await supabase
          .from('articles')
          .delete()
          .eq('id', previousId)
        if (deleteOldError) {
          console.error('Failed to delete old slug row:', deleteOldError)
          throw new Error(
            `Saved as "${nextId}" but could not remove old slug "${previousId}": ${deleteOldError.message}`
          )
        }
      }

      const saved = rowToArticle(data as ArticleRow)
      setArticles((prev) => {
        const next = { ...prev, [saved.id]: saved }
        if (previousId && previousId !== saved.id) {
          delete next[previousId]
        }
        return next
      })
      return saved
    },
    []
  )

  const deleteArticle = useCallback(async (articleId: string): Promise<void> => {
    const { error: deleteError } = await supabase.from('articles').delete().eq('id', articleId)

    if (deleteError) {
      console.error('Failed to delete article:', deleteError)
      throw new Error(deleteError.message)
    }

    setArticles((prev) => {
      const next = { ...prev }
      delete next[articleId]
      return next
    })
  }, [])

  const resetDefaults = useCallback(async (): Promise<void> => {
    const rows = Object.values(ARTICLES).map(articleToRow)
    const { error: upsertError } = await supabase.from('articles').upsert(rows, { onConflict: 'id' })

    if (upsertError) {
      console.error('Failed to reset defaults:', upsertError)
      throw new Error(upsertError.message)
    }

    await refresh()
  }, [refresh])

  const value = useMemo<ArticlesContextValue>(
    () => ({
      articles,
      articlesList: Object.values(articles),
      loading,
      error,
      getArticle: (id: string) => articles[id] || null,
      saveArticle,
      deleteArticle,
      resetDefaults,
      refresh,
    }),
    [articles, loading, error, saveArticle, deleteArticle, resetDefaults, refresh]
  )

  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>
}

export function useArticles(): ArticlesContextValue {
  const ctx = useContext(ArticlesContext)
  if (!ctx) {
    throw new Error('useArticles must be used within ArticlesProvider')
  }
  return ctx
}

export const ADMIN_PREVIEW_DRAFT_KEY = 'fga_admin_preview_draft_v1'

export function storePreviewDraft(article: Article): void {
  try {
    sessionStorage.setItem(ADMIN_PREVIEW_DRAFT_KEY, JSON.stringify(article))
  } catch (e) {
    console.error('Failed to store preview draft:', e)
  }
}

export function readPreviewDraft(): Article | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_PREVIEW_DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Article
  } catch {
    return null
  }
}

export function clearPreviewDraft(): void {
  sessionStorage.removeItem(ADMIN_PREVIEW_DRAFT_KEY)
}
