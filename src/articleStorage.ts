import { useCallback, useEffect, useState } from 'react'
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

export function useArticles() {
  const [articles, setArticles] = useState<Record<string, Article>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
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

  // Re-fetch when auth session changes (drafts become visible after login)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh()
    })
    return () => subscription.unsubscribe()
  }, [refresh])

  const saveArticle = useCallback(
    async (article: Article): Promise<Article> => {
      const payload = articleToRow({
        ...article,
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

      const saved = rowToArticle(data as ArticleRow)
      setArticles((prev) => ({ ...prev, [saved.id]: saved }))
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

  return {
    articles,
    articlesList: Object.values(articles),
    loading,
    error,
    getArticle: (id: string) => articles[id] || null,
    saveArticle,
    deleteArticle,
    resetDefaults,
    refresh,
  }
}
