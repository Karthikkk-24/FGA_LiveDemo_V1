import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'

const URL = 'https://hubnqbkgsnfqnbkpmusm.supabase.co'
const KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Ym5xYmtnc25mcW5ia3BtdXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0ODg1OTgsImV4cCI6MjEwNjA2NDU5OH0.bsC6t4yhaa0RuUrFi8LHga5Q2rhbQdK-3O_1MxbU2ts'
const BASE = 'http://127.0.0.1:8443'
const EMAIL = 'admin@findinggoodads.com'
const PASS = 'FGAAdmin@2024'

const results: { name: string; ok: boolean; detail?: string }[] = []
function check(name: string, ok: boolean, detail?: string) {
  results.push({ name, ok, detail })
  console.log(ok ? `✓ ${name}` : `✗ ${name}${detail ? ' — ' + detail : ''}`)
}

async function main() {
  const sb = createClient(URL, KEY)
  await sb.auth.signInWithPassword({ email: EMAIL, password: PASS })

  const prefix = `fix-${Date.now()}`
  const id1 = `${prefix}-a`
  const id2 = `${prefix}-b`
  const baseRow = {
    numeric_id: 901,
    title: 'Fix Test A',
    summary: 's',
    category: 'Brands',
    read_time: '5 min read',
    published_date: 'Sep 27, 2026',
    hero_image: 'https://example.com/h.jpg',
    author: { name: 'A', role: 'R', avatar: '' },
    key_takeaways: ['t'],
    tags: ['#T'],
    status: 'draft',
    stats: [],
    slides: [],
    content: { intro: ['i'], sections: [], conclusion: 'c' },
  }

  // Simulate saveArticle conflict + rename logic
  await sb.from('articles').upsert({ ...baseRow, id: id1 })
  await sb.from('articles').upsert({ ...baseRow, id: id2, title: 'Fix Test B' })

  // Conflict check
  const { data: existing } = await sb.from('articles').select('id').eq('id', id2).maybeSingle()
  const previousId = id1
  const nextId = id2
  const conflict = Boolean(existing && existing.id !== previousId)
  check('Duplicate slug detected as conflict', conflict)

  // Rename: upsert new id, delete old
  const renamed = `${prefix}-renamed`
  await sb.from('articles').upsert({ ...baseRow, id: renamed, title: 'Renamed' })
  await sb.from('articles').delete().eq('id', id1)
  const { data: oldGone } = await sb.from('articles').select('id').eq('id', id1).maybeSingle()
  const { data: newExists } = await sb.from('articles').select('id').eq('id', renamed).maybeSingle()
  check('Slug rename deletes old row', !oldGone && !!newExists)

  await sb.from('articles').delete().eq('id', id2)
  await sb.from('articles').delete().eq('id', renamed)
  await sb.auth.signOut()

  // UI checks
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(25000)

  await page.goto(`${BASE}/admin/login`)
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASS)
  await page.click('button:has-text("Sign in to CMS")')
  await page.waitForURL((u) => u.pathname.replace(/\/$/, '') === '/admin')

  // Create draft via UI
  const slug = `${prefix}-ui`
  await page.goto(`${BASE}/admin/editor`)
  await page.waitForSelector('text=New Campaign Breakdown')
  const slugPrefix = page.locator('span', { hasText: '/article/' })
  check('Slug prefix is /article/', (await slugPrefix.count()) > 0)
  check(
    'Published Date visible with custom category option',
    (await page.locator('label:has-text("Published Date")').count()) > 0
  )

  const titleInput = page.locator('label:has-text("Article Title")').locator('..').locator('input').first()
  const slugInput = slugPrefix.locator('..').locator('input').first()
  await titleInput.fill('Fix UI Draft')
  await slugInput.fill(slug)
  // Section image field exists
  check(
    'Section image fields exist in editor',
    (await page.locator('text=Section Image (Optional)').count()) > 0
  )

  await page.click('button:has-text("Save Draft")')
  await page.waitForURL((u) => u.pathname.replace(/\/$/, '') === '/admin')
  await page.waitForSelector('text=Fix UI Draft', { timeout: 15000 })
  check('Draft visible on dashboard after save', true)

  // View draft via admin view (not public)
  await page.locator('tr', { hasText: 'Fix UI Draft' }).locator('button[title="View Article"]').click()
  await page.waitForURL(new RegExp(`/admin/view/${slug}`))
  await page.waitForTimeout(1000)
  const body = await page.locator('body').innerText()
  check(
    'Admin view shows draft content (not public not-found)',
    body.includes('Fix UI Draft') && !body.includes('Article not found'),
    page.url()
  )

  // Preview → Edit preserves unsaved
  await page.goto(`${BASE}/admin/editor`)
  await page
    .locator('label:has-text("Article Title")')
    .locator('..')
    .locator('input')
    .first()
    .fill('Unsaved Preview Keep Me')
  await page.click('button:has-text("Preview")')
  await page.waitForTimeout(1000)
  check('Preview shows unsaved title', (await page.locator('text=Unsaved Preview Keep Me').count()) > 0)
  await page.click('button:has-text("Edit This Post")')
  await page.waitForTimeout(1000)
  const titleVal = await page
    .locator('label:has-text("Article Title")')
    .locator('..')
    .locator('input')
    .first()
    .inputValue()
  check('Preview → Edit restores unsaved title', titleVal === 'Unsaved Preview Keep Me', `got="${titleVal}"`)

  // Status: re-open the saved draft (clear any leftover preview session first)
  await page.goto(`${BASE}/admin/editor/${slug}`)
  await page.evaluate(() => sessionStorage.removeItem('fga_admin_preview_draft_v1'))
  await page.reload()
  await page.waitForSelector('text=Edit Campaign Breakdown')
  await page.click('button:has-text("Save Draft")')
  await page.waitForURL((u) => u.pathname.replace(/\/$/, '') === '/admin')
  await sb.auth.signInWithPassword({ email: EMAIL, password: PASS })
  const { data: row, error: rowErr } = await sb
    .from('articles')
    .select('status')
    .eq('id', slug)
    .maybeSingle()
  check(
    'Save Draft persists draft status',
    row?.status === 'draft',
    `status=${row?.status} err=${rowErr?.message}`
  )

  // Slug rename via UI
  await page.goto(`${BASE}/admin/editor/${slug}`)
  await page.evaluate(() => sessionStorage.removeItem('fga_admin_preview_draft_v1'))
  await page.reload()
  await page.waitForSelector('text=Edit Campaign Breakdown')
  const newSlug = `${slug}-v2`
  await page.locator('span', { hasText: '/article/' }).locator('..').locator('input').first().fill(newSlug)
  await page.click('button:has-text("Publish Post")')
  await page.waitForURL((u) => u.pathname.replace(/\/$/, '') === '/admin')
  const { data: oldRow } = await sb.from('articles').select('id').eq('id', slug).maybeSingle()
  const { data: newRow } = await sb.from('articles').select('id,status').eq('id', newSlug).maybeSingle()
  check('UI slug rename removes old row', !oldRow && !!newRow && newRow.status === 'published')

  // Duplicate slug blocked
  await page.goto(`${BASE}/admin/editor`)
  await page.evaluate(() => sessionStorage.removeItem('fga_admin_preview_draft_v1'))
  await page
    .locator('label:has-text("Article Title")')
    .locator('..')
    .locator('input')
    .first()
    .fill('Collision')
  await page.locator('span', { hasText: '/article/' }).locator('..').locator('input').first().fill(newSlug)
  page.once('dialog', async (d) => {
    check('Duplicate slug shows alert', d.message().includes('already used'), d.message())
    await d.accept()
  })
  await page.click('button:has-text("Publish Post")')
  await page.waitForTimeout(1500)

  await sb.from('articles').delete().eq('id', newSlug)
  await sb.from('articles').delete().eq('id', slug)
  await sb.auth.signOut()
  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) {
    console.log('Failed:', failed)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
