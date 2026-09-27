import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Article } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — DB features will fail.'
  )
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
)

/** DB row shape for public.articles */
export interface ArticleRow {
  id: string
  numeric_id: number
  title: string
  summary: string
  category: string
  read_time: string
  published_date: string
  hero_image: string
  author: Article['author']
  key_takeaways: string[]
  tags: string[]
  status: 'published' | 'draft'
  stats: { label: string; value: string }[]
  slides: NonNullable<Article['slides']>
  content: Article['content']
  created_at?: string
  updated_at?: string
}

export function articleToRow(article: Article): ArticleRow {
  return {
    id: article.id,
    numeric_id: article.numericId,
    title: article.title,
    summary: article.summary,
    category: article.category,
    read_time: article.readTime,
    published_date: article.publishedDate,
    hero_image: article.heroImage,
    author: article.author,
    key_takeaways: article.keyTakeaways || [],
    tags: article.tags || [],
    status: article.status || 'published',
    stats: article.stats || [],
    slides: article.slides || [],
    content: article.content,
  }
}

export function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    numericId: row.numeric_id,
    title: row.title,
    summary: row.summary,
    category: row.category,
    readTime: row.read_time,
    publishedDate: row.published_date,
    heroImage: row.hero_image,
    author: row.author,
    keyTakeaways: row.key_takeaways || [],
    tags: row.tags || [],
    status: row.status || 'published',
    stats: row.stats || [],
    slides: row.slides || [],
    content: row.content,
  }
}
