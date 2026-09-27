/**
 * Create 10 campaign breakdown posts, E2E-verify them, and leave them in Supabase.
 * Run: npx tsx scripts/create-ten-posts.ts
 */
import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'
import type { Article } from '../src/types'

const URL = process.env.VITE_SUPABASE_URL || 'https://hubnqbkgsnfqnbkpmusm.supabase.co'
const KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Ym5xYmtnc25mcW5ia3BtdXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0ODg1OTgsImV4cCI6MjEwNjA2NDU5OH0.bsC6t4yhaa0RuUrFi8LHga5Q2rhbQdK-3O_1MxbU2ts'
const BASE = process.env.BASE_URL || 'http://127.0.0.1:8443'
const EMAIL = 'admin@findinggoodads.com'
const PASS = 'FGAAdmin@2024'

const AUTHOR = {
  name: 'FGA Editorial',
  role: 'Campaign Analyst',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
}

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

const POSTS: Article[] = [
  {
    id: 'dove-real-beauty',
    numericId: 201,
    title: 'Dove Real Beauty: How Sketches Rewrote Beauty Advertising',
    summary:
      'A social experiment film that made millions question the gap between self-perception and reality — and rebuilt Dove as a cultural brand.',
    category: 'Brands',
    readTime: '8 min read',
    publishedDate: 'Sep 20, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Insight-led creative beats product demos when the insight is universal.',
      'Earned media multiplied a modest media buy into a global conversation.',
      'Consistency across years turned a campaign into a brand platform.',
    ],
    tags: ['#Beauty', '#Insight', '#Film'],
    stats: [
      { label: 'Views', value: '180M+' },
      { label: 'Earned value', value: '$150M' },
      { label: 'Brand lift', value: '+30%' },
    ],
    slides: [
      {
        id: 1,
        title: 'Slide 01: The Self-Sketch Gap',
        caption: 'Women described themselves harsher than strangers did.',
        imageUrl:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=450&fit=crop&auto=format',
      },
    ],
    content: {
      intro: [
        'Dove’s Real Beauty Sketches did not sell soap. It sold a truth women already felt but rarely saw in advertising.',
        'The film’s power came from a simple forensic: how we see ourselves versus how others see us.',
      ],
      sections: [
        {
          heading: '1. The Insight',
          body: [
            'Research showed most women did not consider themselves beautiful. Dove weaponized that gap with a forensic artist experiment.',
            'By letting strangers describe subjects more kindly than the subjects described themselves, Dove made the insight undeniable on camera.',
          ],
          image: {
            url: 'https://images.unsplash.com/photo-1515377905703-c55026ce6b80?w=900&h=500&fit=crop&auto=format',
            caption: 'Emotional payoff without product hard-sell',
          },
        },
        {
          heading: '2. Distribution as Strategy',
          body: [
            'A short film built for YouTube and PR traveled farther than a classic TV spot schedule.',
            'The brand owned the conversation because the creative invited self-identification, not just applause.',
          ],
        },
      ],
      conclusion:
        'Real Beauty worked because Dove chose a cultural problem bigger than cleanser — and stayed with it for years.',
    },
  },
  {
    id: 'old-spice-the-man-your-man-could-smell-like',
    numericId: 202,
    title: 'Old Spice: The Man Your Man Could Smell Like',
    summary:
      'A single absurdist spot flipped a dated deodorant brand into a meme machine — then scaled the joke into interactive response ads.',
    category: 'Storytelling',
    readTime: '7 min read',
    publishedDate: 'Sep 18, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1621607512214-682974801093?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Humor + precision casting can rejuvenate a legacy brand overnight.',
      'Real-time response content turns a spot into a platform.',
      'Speaking to buyers (women) about users (men) unlocked a new funnel.',
    ],
    tags: ['#Humor', '#Viral', '#Response'],
    stats: [
      { label: 'YouTube views', value: '60M+' },
      { label: 'Sales lift', value: '+107%' },
      { label: 'Response videos', value: '186' },
    ],
    slides: [],
    content: {
      intro: [
        'Old Spice was your grandfather’s cologne until Wieden+Kennedy made it today’s absurd romance novel.',
        'Isaiah Mustafa’s unbroken take became a cultural dialect — then a response factory.',
      ],
      sections: [
        {
          heading: '1. Talk to the Buyer',
          body: [
            'The spot addressed women shopping for men, flipping the category’s typical testosterone theater.',
            'That audience insight made the joke land harder than another “be a man” anthem.',
          ],
        },
        {
          heading: '2. From Spot to System',
          body: [
            'When the brand answered YouTube comments with personalized videos in near real time, the campaign became a living show.',
            'Speed and volume of response content created a second wave of earned media.',
          ],
        },
      ],
      conclusion:
        'Old Spice proved a legacy brand can become modern by committing to a voice — then flooding the internet with it.',
    },
  },
  {
    id: 'always-like-a-girl',
    numericId: 203,
    title: 'Always #LikeAGirl: Turning an Insult into a Rallying Cry',
    summary:
      'A Super Bowl film that redefined a phrase, recruited a generation of girls, and gave Always a purpose beyond product periods.',
    category: 'Culture',
    readTime: '6 min read',
    publishedDate: 'Sep 15, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Reclaiming language is a powerful brand strategy when it feels earned.',
      'Purpose campaigns need proof, not just posters.',
      'School-age insight can unlock adult media moments.',
    ],
    tags: ['#Purpose', '#SuperBowl', '#Social'],
    stats: [
      { label: 'Views', value: '90M+' },
      { label: 'Confidence lift', value: 'Measurable' },
      { label: 'Hashtag use', value: 'Global' },
    ],
    slides: [],
    content: {
      intro: [
        'Always asked people to act “like a girl” — then showed how the phrase collapses confidence after puberty.',
        'The film’s contrast edit made the cultural injury impossible to ignore.',
      ],
      sections: [
        {
          heading: '1. Insight as Confrontation',
          body: [
            'Young girls ran, fought, and threw “like a girl” with pride. Adults performed weakness. The cut between them was the argument.',
            'Always owned the redefinition by attaching programs and school activations beyond the film.',
          ],
        },
      ],
      conclusion:
        '#LikeAGirl succeeded because it rewired a phrase and backed it with long-term brand action.',
    },
  },
  {
    id: 'tesla-product-reveal',
    numericId: 204,
    title: 'Tesla’s Product Reveals: When the Product Is the Ad',
    summary:
      'No agency reel required — livestreamed unveilings, founder theater, and community amplification turned cars into appointment viewing.',
    category: 'Tech',
    readTime: '9 min read',
    publishedDate: 'Sep 12, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Appointment livestreams can replace traditional launch media.',
      'Founder narrative is a renewable media asset.',
      'Owners and enthusiasts become the distribution layer.',
    ],
    tags: ['#Launch', '#Livestream', '#Product'],
    stats: [
      { label: 'Peak concurrent', value: 'Millions' },
      { label: 'Ad spend', value: 'Near $0' },
      { label: 'Preorders', value: 'Record' },
    ],
    slides: [],
    content: {
      intro: [
        'Tesla spent almost nothing on classic advertising while making unveilings feel like cultural events.',
        'The product, the founder, and an online tribe did the media work.',
      ],
      sections: [
        {
          heading: '1. Event as Medium',
          body: [
            'Reveals were staged like tech keynotes: scarcity, drama, and a cliffhanger roadmap.',
            'Each event fed weeks of secondary coverage without a paid flight.',
          ],
        },
        {
          heading: '2. Community Distribution',
          body: [
            'Owners filmed deliveries, mods, and road trips — unpaid brand media at planetary scale.',
            'The company amplified the best UGC instead of drowning it with polished spots.',
          ],
        },
      ],
      conclusion:
        'Tesla showed that when demand and myth are strong enough, the product launch is the campaign.',
    },
  },
  {
    id: 'patagonia-dont-buy-this-jacket',
    numericId: 205,
    title: "Patagonia's Don't Buy This Jacket: Anti-Consumption as Loyalty",
    summary:
      'A Black Friday ad that told people not to buy — and deepened trust with the customers who matter most.',
    category: 'Brands',
    readTime: '7 min read',
    publishedDate: 'Sep 10, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Counterintuitive messaging works when brand proof is real.',
      'Values marketing fails without operational follow-through.',
      'Saying no to volume can raise lifetime value.',
    ],
    tags: ['#Sustainability', '#Print', '#Trust'],
    stats: [
      { label: 'NYT placement', value: 'Black Friday' },
      { label: 'Sales effect', value: 'Up, not down' },
      { label: 'Repairs', value: 'Scaled' },
    ],
    slides: [],
    content: {
      intro: [
        'Patagonia ran a full-page ad asking customers not to buy its bestselling jacket unless they truly needed it.',
        'The provocation only worked because repair, reuse, and activism were already part of the business.',
      ],
      sections: [
        {
          heading: '1. Permission to Critique Consumption',
          body: [
            'By questioning Black Friday excess, Patagonia positioned itself against the category’s default greed.',
            'Customers who shared those values felt seen — and bought with less guilt when they did buy.',
          ],
        },
      ],
      conclusion:
        'Don’t Buy This Jacket is proof that brand courage compounds when operations match the manifesto.',
    },
  },
  {
    id: 'red-bull-stratos',
    numericId: 206,
    title: 'Red Bull Stratos: Content Marketing from the Edge of Space',
    summary:
      'A space jump that made Red Bull synonymous with human extremes — and set the template for brand-owned spectacle.',
    category: 'Culture',
    readTime: '8 min read',
    publishedDate: 'Sep 8, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Own the spectacle; don’t just sponsor it.',
      'Live risk creates unmatched appointment viewing.',
      'Brand = verb when experiences define the product.',
    ],
    tags: ['#Spectacle', '#Live', '#Ownership'],
    stats: [
      { label: 'Live viewers', value: '8M+' },
      { label: 'YouTube concurrent', value: 'Record' },
      { label: 'Earned media', value: 'Billions' },
    ],
    slides: [],
    content: {
      intro: [
        'Felix Baumgartner’s jump from the stratosphere was not a logo on a helmet — it was Red Bull’s story.',
        'The brand produced, owned, and distributed the moment like a media company.',
      ],
      sections: [
        {
          heading: '1. Media Company Logic',
          body: [
            'Years of engineering, storytelling, and live production made the jump a Red Bull property.',
            'Competitors could buy athlete posts; they could not buy the narrative ownership.',
          ],
        },
      ],
      conclusion:
        'Stratos cemented Red Bull’s thesis: the brand is the content studio for human extremes.',
    },
  },
  {
    id: 'airbnb-belong-anywhere',
    numericId: 207,
    title: 'Airbnb Belong Anywhere: Selling Belonging, Not Beds',
    summary:
      'How Airbnb shifted from listings to a global belonging platform — and why emotional positioning beat feature lists.',
    category: 'Storytelling',
    readTime: '7 min read',
    publishedDate: 'Sep 5, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Category leaders sell feeling states, not inventory.',
      'Host stories humanize a two-sided marketplace.',
      'Brand systems must work in product UI and TV equally.',
    ],
    tags: ['#Brand', '#Travel', '#Emotion'],
    stats: [
      { label: 'Brand idea', value: 'Belonging' },
      { label: 'Markets', value: '190+' },
      { label: 'Creative system', value: 'Global' },
    ],
    slides: [],
    content: {
      intro: [
        'Airbnb could have advertised cheaper rooms. Instead it sold the feeling of belonging anywhere.',
        'That frame elevated hosts, guests, and the product into a cultural promise.',
      ],
      sections: [
        {
          heading: '1. From Inventory to Identity',
          body: [
            'Campaigns centered people and places over price comparisons with hotels.',
            'Belonging became a filter for product features, community standards, and crisis response.',
          ],
        },
      ],
      conclusion:
        'Belong Anywhere shows how a marketplace brand wins when emotion sits above feature competition.',
    },
  },
  {
    id: 'liquid-death-murder-your-thirst',
    numericId: 208,
    title: 'Liquid Death: Selling Water Like a Heavy Metal Band',
    summary:
      'Tallboy cans, death-metal branding, and anti-plastic punk energy turned still water into a lifestyle brand.',
    category: 'Brands',
    readTime: '6 min read',
    publishedDate: 'Sep 3, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'published',
    keyTakeaways: [
      'Packaging and tone can differentiate a commodity.',
      'Subculture aesthetics attract mainstream curiosity.',
      'Entertainment content is the media plan.',
    ],
    tags: ['#Packaging', '#DTC', '#Tone'],
    stats: [
      { label: 'Valuation path', value: 'Unicorn arc' },
      { label: 'Retail', value: 'Mass' },
      { label: 'Content', value: 'Constant' },
    ],
    slides: [],
    content: {
      intro: [
        'Liquid Death made water feel dangerous, funny, and collectible — the opposite of spa-minimal hydration brands.',
        'The can was the billboard; the content was the campaign.',
      ],
      sections: [
        {
          heading: '1. Category Violation',
          body: [
            'By borrowing beer and metal codes, Liquid Death escaped the bland aisle of clear plastic bottles.',
            'Humor videos and stunts kept the brand in feeds without classic CPG media math.',
          ],
        },
      ],
      conclusion:
        'Murder Your Thirst proves tone and format can create desire in the most boring category on earth.',
    },
  },
  {
    id: 'glossier-into-the-gloss',
    numericId: 209,
    title: 'Glossier: Community as the Creative Department',
    summary:
      'How a blog audience became a beauty empire — and why listening loops beat splashy launch films.',
    category: 'Tech',
    readTime: '8 min read',
    publishedDate: 'Sep 1, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'draft',
    keyTakeaways: [
      'Audience-first brands can productize trust.',
      'UGC aesthetics became the house style.',
      'Soft launch culture reduces paid acquisition dependence.',
    ],
    tags: ['#Community', '#Beauty', '#DTC'],
    stats: [
      { label: 'Origin', value: 'Blog' },
      { label: 'Style', value: 'UGC-native' },
      { label: 'Moat', value: 'Community' },
    ],
    slides: [],
    content: {
      intro: [
        'Glossier started as Into The Gloss — a comment section with taste — then shipped products the audience already wanted.',
        'The brand look felt like a friend’s bathroom shelf, not a department-store counter.',
      ],
      sections: [
        {
          heading: '1. Comments to SKUs',
          body: [
            'Product decisions were informed by years of reader dialogue, collapsing research and creative into one loop.',
            'Pink pouches and dewy selfies became unpaid media that looked like the brand because they were the brand.',
          ],
        },
      ],
      conclusion:
        'Glossier’s lesson: build the room first, then sell what the room asks for. (Draft — pending final edit.)',
    },
  },
  {
    id: 'oreo-dunk-in-the-dark',
    numericId: 210,
    title: 'Oreo Dunk in the Dark: Real-Time Marketing’s Perfect Moment',
    summary:
      'A 15-minute tweet during a Super Bowl blackout that became the case study every brand still chases.',
    category: 'Culture',
    readTime: '5 min read',
    publishedDate: 'Aug 28, 2026',
    heroImage:
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&h=630&fit=crop&auto=format',
    author: AUTHOR,
    status: 'draft',
    keyTakeaways: [
      'Preparation beats improvisation — war rooms enable “luck.”',
      'One sharp line can outperform a $4M spot.',
      'Real-time only works with brand permission to be playful.',
    ],
    tags: ['#Realtime', '#Social', '#SuperBowl'],
    stats: [
      { label: 'Time to post', value: '~15 min' },
      { label: 'Retweets', value: 'Viral' },
      { label: 'Cost', value: 'Near $0' },
    ],
    slides: [],
    content: {
      intro: [
        'When the Super Bowl lights died, Oreo’s team dunked a cookie in darkness and won the night.',
        'The tweet worked because the war room, brand voice, and legal clearance were already ready.',
      ],
      sections: [
        {
          heading: '1. Luck Is a Process',
          body: [
            'Agencies and clients had practiced scenarios; the blackout was the trigger, not the strategy.',
            'Speed without brand fit would have been noise. Oreo’s playful equity made the joke feel inevitable.',
          ],
        },
      ],
      conclusion:
        'Dunk in the Dark remains the benchmark for real-time — and a reminder that readiness is the real media buy. (Draft.)',
    },
  },
]

async function main() {
  const sb = createClient(URL, KEY)
  const { error: authError } = await sb.auth.signInWithPassword({ email: EMAIL, password: PASS })
  if (authError) {
    console.error('Auth failed:', authError.message)
    process.exit(1)
  }

  console.log(`\n=== Creating ${POSTS.length} posts (will NOT delete) ===\n`)
  const rows = POSTS.map(articleToRow)
  const { data, error } = await sb.from('articles').upsert(rows, { onConflict: 'id' }).select('id,title,status')
  if (error) {
    console.error('Upsert failed:', error.message)
    process.exit(1)
  }
  for (const row of data || []) {
    console.log(`  ✓ saved [${row.status}] ${row.id} — ${row.title}`)
  }

  // DB verification
  console.log('\n=== DB verification ===\n')
  let dbOk = 0
  for (const post of POSTS) {
    const { data: row } = await sb.from('articles').select('*').eq('id', post.id).maybeSingle()
    const fieldsOk =
      !!row &&
      row.title === post.title &&
      row.status === post.status &&
      row.category === post.category &&
      Array.isArray(row.key_takeaways) &&
      row.key_takeaways.length === post.keyTakeaways.length &&
      row.content?.sections?.length === post.content.sections.length &&
      row.hero_image === post.heroImage
    console.log(fieldsOk ? `  ✓ DB fields OK: ${post.id}` : `  ✗ DB fields FAIL: ${post.id}`)
    if (fieldsOk) dbOk++
  }

  await sb.auth.signOut()

  // UI E2E
  console.log('\n=== UI E2E verification ===\n')
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultTimeout(30000)

  async function waitSettled(expectedId: string) {
    await page.waitForFunction(
      (id: string) => {
        const t = document.body?.innerText || ''
        if (t.length < 40) return false
        if (t.includes('Loading article')) return false
        return (
          t.includes('Article not found') ||
          t.includes(id) ||
          t.includes('LIVE POST') ||
          t.includes('Back to Breakdowns')
        )
      },
      expectedId,
      { timeout: 25000 }
    )
  }

  await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' })
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASS)
  await page.click('button:has-text("Sign in to CMS")')
  await page.waitForURL((u) => u.pathname.replace(/\/$/, '') === '/admin')
  await page.waitForTimeout(2000)

  let uiOk = 0
  for (const post of POSTS) {
    await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1200)
    const dashText = await page.locator('body').innerText()
    const onDash = dashText.includes(post.title.slice(0, 18)) || dashText.includes(post.id)
    console.log(onDash ? `  ✓ Dashboard lists: ${post.id}` : `  ✗ Missing on dashboard: ${post.id}`)
    if (!onDash) continue

    await page.goto(`${BASE}/admin/view/${post.id}`, { waitUntil: 'domcontentloaded' })
    await waitSettled(post.id)
    const body = await page.locator('body').innerText()
    const viewOk = !body.includes('Article not found') && body.includes(post.id)
    console.log(viewOk ? `  ✓ Admin view: ${post.id}` : `  ✗ Admin view fail: ${post.id}`)
    if (!viewOk) continue

    await page.goto(`${BASE}/article/${post.id}`, { waitUntil: 'domcontentloaded' })
    await waitSettled(post.id)
    const pub = await page.locator('body').innerText()
    if (post.status === 'published') {
      const pubOk = !pub.includes('Article not found') && pub.length > 200
      console.log(pubOk ? `  ✓ Public article: ${post.id}` : `  ✗ Public fail: ${post.id}`)
      if (pubOk) uiOk++
    } else {
      const hidden = pub.includes('Article not found')
      console.log(hidden ? `  ✓ Draft hidden publicly: ${post.id}` : `  ✗ Draft leaked publicly: ${post.id}`)
      if (hidden) uiOk++
    }
  }

  // Homepage should show published titles
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  const home = await page.locator('body').innerText()
  const published = POSTS.filter((p) => p.status === 'published')
  let homeOk = 0
  for (const post of published) {
    const short = post.title.slice(0, 28)
    const ok = home.includes(short)
    console.log(ok ? `  ✓ Home shows: ${short}…` : `  ✗ Home missing: ${short}…`)
    if (ok) homeOk++
  }

  await browser.close()

  const { data: all } = await (async () => {
    const client = createClient(URL, KEY)
    await client.auth.signInWithPassword({ email: EMAIL, password: PASS })
    const res = await client.from('articles').select('id,status')
    await client.auth.signOut()
    return res
  })()

  console.log('\n=== Summary ===')
  console.log(`Created/updated: ${POSTS.length} posts (left in DB)`)
  console.log(`DB field checks: ${dbOk}/${POSTS.length}`)
  console.log(`UI view checks:  ${uiOk}/${POSTS.length}`)
  console.log(`Home published:  ${homeOk}/${published.length}`)
  console.log(`Total articles now in project: ${all?.length ?? '?'}`)
  console.log(
    `Statuses: ${POSTS.filter((p) => p.status === 'published').length} published, ${POSTS.filter((p) => p.status === 'draft').length} draft`
  )

  const failed = dbOk < POSTS.length || uiOk < POSTS.length
  if (failed) process.exit(1)
  console.log('\nAll E2E checks passed. Posts remain in the project.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
