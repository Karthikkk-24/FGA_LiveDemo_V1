import { useState, useEffect, useCallback } from 'react'
import { Article } from './types'
import { ARTICLES } from './data'

const STORAGE_KEY = 'fga_articles_v2'

export function getStoredArticles(): Record<string, Article> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to load articles from localStorage:', e)
  }

  // Default initial set
  saveStoredArticles(ARTICLES)
  return ARTICLES
}

export function saveStoredArticles(articles: Record<string, Article>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch (e) {
    console.error('Failed to save articles to localStorage:', e)
  }
}

// Global event target for cross-component sync
const syncTarget = new EventTarget()
const SYNC_EVENT = 'fga_articles_sync'

export function useArticles() {
  const [articles, setArticles] = useState<Record<string, Article>>(() => getStoredArticles())

  const refresh = useCallback(() => {
    setArticles(getStoredArticles())
  }, [])

  useEffect(() => {
    const handler = () => refresh()
    syncTarget.addEventListener(SYNC_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      syncTarget.removeEventListener(SYNC_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [refresh])

  const saveArticle = useCallback((article: Article) => {
    const current = getStoredArticles()
    const updated = {
      ...current,
      [article.id]: {
        ...article,
        status: article.status || 'published',
      },
    }
    saveStoredArticles(updated)
    syncTarget.dispatchEvent(new Event(SYNC_EVENT))
    return article
  }, [])

  const deleteArticle = useCallback((articleId: string) => {
    const current = getStoredArticles()
    const updated = { ...current }
    delete updated[articleId]
    saveStoredArticles(updated)
    syncTarget.dispatchEvent(new Event(SYNC_EVENT))
  }, [])

  const resetDefaults = useCallback(() => {
    saveStoredArticles(ARTICLES)
    syncTarget.dispatchEvent(new Event(SYNC_EVENT))
  }, [])

  return {
    articles,
    articlesList: Object.values(articles),
    getArticle: (id: string) => articles[id] || null,
    saveArticle,
    deleteArticle,
    resetDefaults,
    refresh,
  }
}
