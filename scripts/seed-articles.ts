/**
 * One-off seed: upserts default campaign articles into Supabase.
 * Run: npx tsx scripts/seed-articles.ts
 */
import { createClient } from '@supabase/supabase-js'
import { ARTICLES } from '../src/data'
import type { Article } from '../src/types'

const url = process.env.VITE_SUPABASE_URL || 'https://hubnqbkgsnfqnbkpmusm.supabase.co'
const key =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Ym5xYmtnc25mcW5ia3BtdXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0ODg1OTgsImV4cCI6MjEwNjA2NDU5OH0.bsC6t4yhaa0RuUrFi8LHga5Q2rhbQdK-3O_1MxbU2ts'

const email = process.env.SEED_ADMIN_EMAIL || 'admin@findinggoodads.com'
const password = process.env.SEED_ADMIN_PASSWORD || 'FGAAdmin@2024'

function articleToRow(article: Article) {
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

async function main() {
  const supabase = createClient(url, key)

  const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
  if (authError) {
    console.error('Auth failed:', authError.message)
    process.exit(1)
  }

  const rows = Object.values(ARTICLES).map(articleToRow)
  const { data, error } = await supabase.from('articles').upsert(rows, { onConflict: 'id' }).select('id')

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`Seeded ${data?.length ?? 0} articles:`, data?.map((r) => r.id).join(', '))
  await supabase.auth.signOut()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
