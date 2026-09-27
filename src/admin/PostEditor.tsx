import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Save,
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  TrendingUp,
  Sliders,
  Eye,
  Quote,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Clock,
  Calendar,
  Tag,
  User
} from 'lucide-react'
import { Article, ArticleSection, SlideItem } from '../types'

interface PostEditorProps {
  initialArticle?: Article | null
  onSave: (article: Article) => void | Promise<void>
  onCancel: () => void
  onPreview: (article: Article) => void
}

const PRESET_CATEGORIES = ['PR Stunt', 'Celebrity', 'Sports', 'Brands', 'Business', 'Viral Campaign', 'Product Launch']

export function PostEditor({
  initialArticle,
  onSave,
  onCancel,
  onPreview,
}: PostEditorProps) {
  const isEditing = Boolean(initialArticle?.id)

  // Meta fields
  const [title, setTitle] = useState(initialArticle?.title || '')
  const [slug, setSlug] = useState(initialArticle?.id || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing)
  const [summary, setSummary] = useState(initialArticle?.summary || '')
  const [category, setCategory] = useState(initialArticle?.category || 'PR Stunt')
  const [customCategory, setCustomCategory] = useState('')
  const [isCustomCategory, setIsCustomCategory] = useState(
    Boolean(initialArticle?.category && !PRESET_CATEGORIES.includes(initialArticle.category))
  )
  const [readTime, setReadTime] = useState(initialArticle?.readTime || '5 min read')
  const [publishedDate, setPublishedDate] = useState(
    initialArticle?.publishedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  )
  const [heroImage, setHeroImage] = useState(
    initialArticle?.heroImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&h=900&fit=crop&auto=format'
  )
  const [tagsInput, setTagsInput] = useState((initialArticle?.tags || ['#Marketing', '#Campaign']).join(', '))
  const [status, setStatus] = useState<'published' | 'draft'>(initialArticle?.status || 'published')

  // Author fields
  const [authorName, setAuthorName] = useState(initialArticle?.author?.name || 'Marcus Vance')
  const [authorRole, setAuthorRole] = useState(initialArticle?.author?.role || 'Lead Campaign Strategist at FGA')
  const [authorAvatar, setAuthorAvatar] = useState(
    initialArticle?.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format'
  )
  const [authorHandle, setAuthorHandle] = useState(initialArticle?.author?.handle || '@marcusvance')

  // Key Metrics (Stat Cards)
  const [stats, setStats] = useState<{ label: string; value: string }[]>(
    initialArticle?.stats && initialArticle.stats.length > 0
      ? initialArticle.stats
      : [
          { label: 'Earned Media Value', value: '$34.8M' },
          { label: 'Social Engagement', value: '+340%' },
          { label: 'First Year Volume', value: '150,000+' },
        ]
  )

  // Core Takeaways
  const [takeaways, setTakeaways] = useState<string[]>(
    initialArticle?.keyTakeaways && initialArticle.keyTakeaways.length > 0
      ? initialArticle.keyTakeaways
      : [
          'Subcultural Adoption Over Mass Advertising: Let community evangelists shape the narrative.',
          'Scarcity Engineering via Timed Drops: Limit initial batch availability to ignite secondary interest.',
          'Aesthetic Alignment with Creator Feeds: Package physical products for spontaneous social photography.',
        ]
  )

  // Body Content: Intro
  const [introText, setIntroText] = useState(
    (initialArticle?.content?.intro || [
      'In today’s hyper-saturated media environment, traditional ad buys are yielding diminishing returns.',
      'Here is the exact strategy and creative machinery that turned this campaign into an undeniable cultural phenomenon.',
    ]).join('\n\n')
  )

  // Body Content: Sections
  const [sections, setSections] = useState<ArticleSection[]>(
    initialArticle?.content?.sections && initialArticle.content.sections.length > 0
      ? initialArticle.content.sections
      : [
          {
            heading: '1. The Radical Departure from the Status Quo',
            subheading: 'Breaking the primary rule of the category',
            body: [
              'While competitors poured millions into standard broadcast media, the core team realized that culture happens from the bottom up.',
              'They bypassed traditional agency committees and executed with the speed of internet gossip.',
            ],
            quote: {
              text: 'The greatest product marketing does not create obsession from scratch; it detects existing human rituals.',
              author: 'Campaign Lead',
            },
            callout: 'Key Insight: Speed of cultural relevance consistently beats high-budget perfection.',
          },
          {
            heading: '2. The UGC Distribution Flywheel',
            subheading: 'Designing an environment people want to photograph',
            body: [
              'Every touchpoint was engineered as a cinematographic set for modern mobile camera sensors.',
              'Attendees and customers became an unpaid distributed PR machine.',
            ],
          },
        ]
  )

  // Slides (Carousel Breakdown Deck)
  const [slides, setSlides] = useState<SlideItem[]>(
    initialArticle?.slides || [
      {
        id: 1,
        title: 'Slide 01: The Cultural Friction',
        subtitle: 'Identifying the unmet tension in the market',
        caption: 'Traditional competitors were playing it safe with generic celebrity endorsements.',
        imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=450&fit=crop&auto=format',
      },
      {
        id: 2,
        title: 'Slide 02: The Guerilla Rollout',
        subtitle: 'Zero paid media in month one',
        caption: 'Exclusive seeding to 100 core cultural tastemakers generated immediate organic mystique.',
        imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=450&fit=crop&auto=format',
      },
    ]
  )

  // Conclusion
  const [conclusion, setConclusion] = useState(
    initialArticle?.content?.conclusion ||
      'This campaign proved that modern marketing is not about announcing what your product does—it is about gifting your audience an aesthetic identity they are proud to wear.'
  )

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 48)
      setSlug(generated)
    }
  }, [title, slugManuallyEdited])

  // Build the complete Article object
  const constructArticle = (targetStatus?: 'published' | 'draft'): Article => {
    const finalCategory = isCustomCategory ? (customCategory.trim() || 'Uncategorized') : category
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`))

    return {
      id: slug.trim() || `post-${Date.now()}`,
      numericId: initialArticle?.numericId || Math.floor(Math.random() * 900) + 100,
      title: title.trim() || 'Untitled Breakdown',
      summary: summary.trim() || 'Campaign breakdown analysis.',
      category: finalCategory,
      readTime: readTime.trim() || '5 min read',
      publishedDate: publishedDate.trim(),
      heroImage: heroImage.trim(),
      status: targetStatus || status,
      author: {
        name: authorName.trim() || 'FGA Editorial Staff',
        role: authorRole.trim() || 'Strategy Analyst',
        avatar: authorAvatar.trim(),
        handle: authorHandle.trim(),
      },
      keyTakeaways: takeaways.filter((t) => t.trim().length > 0),
      tags: parsedTags.length > 0 ? parsedTags : ['#Advertising', '#Marketing'],
      stats: stats.filter((s) => s.label.trim() && s.value.trim()),
      slides: slides.filter((s) => s.title.trim()),
      content: {
        intro: introText.split('\n\n').map((p) => p.trim()).filter(Boolean),
        sections: sections.filter((s) => s.heading.trim()),
        conclusion: conclusion.trim(),
      },
    }
  }

  const handleSave = async (targetStatus: 'published' | 'draft') => {
    const article = constructArticle(targetStatus)
    await onSave(article)
  }

  // --- Handlers for dynamic arrays ---
  // Stats
  const handleAddStat = () => {
    setStats([...stats, { label: 'New Metric', value: '+100%' }])
  }
  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index))
  }
  const handleUpdateStat = (index: number, field: 'label' | 'value', val: string) => {
    const next = [...stats]
    next[index][field] = val
    setStats(next)
  }

  // Takeaways
  const handleAddTakeaway = () => {
    setTakeaways([...takeaways, ''])
  }
  const handleRemoveTakeaway = (index: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== index))
  }
  const handleUpdateTakeaway = (index: number, val: string) => {
    const next = [...takeaways]
    next[index] = val
    setTakeaways(next)
  }

  // Sections
  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        heading: `${sections.length + 1}. New Campaign Insight`,
        subheading: 'Operational execution details',
        body: ['Add your paragraph analysis here.'],
      },
    ])
  }
  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }
  const handleUpdateSection = (index: number, updated: Partial<ArticleSection>) => {
    const next = [...sections]
    next[index] = { ...next[index], ...updated }
    setSections(next)
  }

  // Slides
  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        id: slides.length + 1,
        title: `Slide 0${slides.length + 1}: Key Turning Point`,
        subtitle: 'Sub-headline analysis',
        caption: 'Description of the ad asset or strategy.',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=450&fit=crop&auto=format',
      },
    ])
  }
  const handleRemoveSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index))
  }
  const handleUpdateSlide = (index: number, updated: Partial<SlideItem>) => {
    const next = [...slides]
    next[index] = { ...next[index], ...updated }
    setSlides(next)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      {/* ─── Sticky Editor Header ───────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: 'rgba(18,18,18,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #222',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#A0A0A0] hover:text-white px-3 py-1.5 rounded transition-all hover:bg-[#1A1A1A] cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Back to Posts</span>
            </button>
            <div className="h-4 w-[1px] bg-[#2A2A2A] hidden sm:block" />
            <span className="font-display font-semibold text-sm sm:text-base text-white hidden sm:block truncate max-w-xs">
              {isEditing ? `Editing: ${title || 'Post'}` : 'Create Campaign Breakdown'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Preview Button */}
            <button
              onClick={() => onPreview(constructArticle())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#A0A0A0] hover:text-white bg-[#1A1A1A] hover:bg-[#242424] border border-[#282828] transition-all cursor-pointer"
              title="Preview with full reader layout"
            >
              <Eye size={13} />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Save as Draft */}
            <button
              onClick={() => handleSave('draft')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/25 transition-all cursor-pointer"
            >
              <Save size={13} />
              <span>Save Draft</span>
            </button>

            {/* Publish */}
            <button
              onClick={() => handleSave('published')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-white bg-[#FF3B00] hover:bg-[#e03400] shadow-[0_0_15px_rgba(255,59,0,0.4)] transition-all cursor-pointer"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>Publish Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Form Body ─────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Intro Banner */}
        <div className="flex items-center justify-between pb-2 border-b border-[#202020]">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {isEditing ? 'Edit Campaign Breakdown' : 'New Campaign Breakdown'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1">
              Configure every detail of your breakdown. All content dynamically renders on the reading page.
            </p>
          </div>
          <span
            className={`font-mono text-xs px-2.5 py-1 rounded border ${
              status === 'draft'
                ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25'
                : 'text-green-400 bg-green-500/10 border-green-500/25'
            }`}
          >
            {status.toUpperCase()}
          </span>
        </div>

        {/* ─── SECTION 1: Meta Information ──────────────────────────── */}
        <section
          className="p-6 sm:p-7 rounded-xl space-y-5"
          style={{
            background: '#1E1E1E',
            border: '1px solid #282828',
            boxShadow: '4px 4px 12px #0a0a0a, -2px -2px 8px #222',
          }}
        >
          <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
            <Tag size={16} className="text-[#FF3B00]" />
            <h2 className="font-display text-base font-semibold text-white">
              1. Meta & Headline Details
            </h2>
          </div>

          {/* Article Title */}
          <div>
            <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
              Article Title (H1) <span className="text-[#FF3B00]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. How 818 Tequila turned a beach club into a content factory"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#141414] text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none text-base font-medium"
            />
          </div>

          {/* Slug / URL identifier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
                URL Identifier / Slug <span className="text-[#FF3B00]">*</span>
              </label>
              <div className="flex items-center bg-[#141414] rounded border border-[#2A2A2A] px-3 py-2 text-xs font-mono text-[#666]">
                <span>#article/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true)
                    setSlug(e.target.value)
                  }}
                  className="bg-transparent text-white outline-none flex-1 ml-1"
                />
              </div>
            </div>

            {/* Estimated Read Time */}
            <div>
              <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
                Estimated Read Time
              </label>
              <input
                type="text"
                placeholder="e.g. 5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none"
              />
            </div>
          </div>

          {/* Category Dropdown + Custom Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
                Category
              </label>
              <select
                value={isCustomCategory ? '__custom__' : category}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomCategory(true)
                  } else {
                    setIsCustomCategory(false)
                    setCategory(e.target.value)
                  }
                }}
                className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none cursor-pointer"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__custom__">+ Enter Custom Category...</option>
              </select>
            </div>

            {isCustomCategory ? (
              <div>
                <label className="block text-xs font-mono text-[#FF3B00] uppercase mb-1.5">
                  Type Custom Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Growth Hacking"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#FF3B00]/40 focus:border-[#FF3B00] outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
                  Published Date
                </label>
                <input
                  type="text"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none"
                />
              </div>
            )}
          </div>

          {/* Subtitle / Lead Hook */}
          <div>
            <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
              Subtitle / Lead Hook
            </label>
            <textarea
              rows={2}
              placeholder="A punchy 1-2 sentence lead explaining why this ad mattered."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none leading-relaxed"
            />
          </div>

          {/* Hero Banner Image URL */}
          <div>
            <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
              Hero Banner Image (16:9 Image URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="flex-1 px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none font-mono"
              />
            </div>
            {/* Live Banner Preview */}
            {heroImage && (
              <div className="mt-3 relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-[#262626] bg-[#141414]">
                <img
                  src={heroImage}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback placeholder on error
                    ;(e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=600&fit=crop&auto=format'
                  }}
                />
                <span className="absolute bottom-2 right-2 text-[0.65rem] font-mono bg-black/70 px-2 py-0.5 rounded text-[#aaa]">
                  16:9 Banner Preview
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
              Topic Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="#Streetwear, #Nike, #Branding, #PRStunt"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none font-mono"
            />
          </div>
        </section>

        {/* ─── SECTION 2: Author Details ────────────────────────────── */}
        <section
          className="p-6 sm:p-7 rounded-xl space-y-4"
          style={{
            background: '#1E1E1E',
            border: '1px solid #282828',
          }}
        >
          <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
            <User size={16} className="text-[#FF3B00]" />
            <h2 className="font-display text-base font-semibold text-white">
              2. Author Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#888] uppercase mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#888] uppercase mb-1">
                Author Role / Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#888] uppercase mb-1">
                Avatar Image URL
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={authorAvatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover border border-[#333]"
                />
                <input
                  type="url"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded bg-[#141414] text-xs text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#888] uppercase mb-1">
                Twitter / Social Handle
              </label>
              <input
                type="text"
                value={authorHandle}
                onChange={(e) => setAuthorHandle(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none font-mono"
              />
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: Key Metrics Bar Builder ────────────────────── */}
        <section
          className="p-6 sm:p-7 rounded-xl space-y-4"
          style={{
            background: '#1E1E1E',
            border: '1px solid #282828',
          }}
        >
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#FF3B00]" />
              <h2 className="font-display text-base font-semibold text-white">
                3. Key Metrics Bar (Stat Cards)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#FF3B00] bg-[#FF3B00]/10 hover:bg-[#FF3B00]/20 border border-[#FF3B00]/25 transition-all cursor-pointer"
            >
              <Plus size={12} /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#141414] border border-[#262626] relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveStat(idx)}
                  className="absolute top-2 right-2 p-1 text-[#666] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Metric"
                >
                  <Trash2 size={13} />
                </button>

                <label className="block text-[0.65rem] font-mono text-[#777] uppercase mb-1">
                  Metric Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Total Revenue"
                  value={stat.label}
                  onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                  className="w-full px-2 py-1 mb-2 rounded bg-[#1A1A1A] text-xs text-white border border-[#282828] outline-none"
                />

                <label className="block text-[0.65rem] font-mono text-[#777] uppercase mb-1">
                  Value Highlight
                </label>
                <input
                  type="text"
                  placeholder="e.g. $800M+"
                  value={stat.value}
                  onChange={(e) => handleUpdateStat(idx, 'value', e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#1A1A1A] text-sm font-bold text-[#FF3B00] border border-[#282828] outline-none"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 4: Core Takeaways Box Builder ─────────────────── */}
        <section
          className="p-6 sm:p-7 rounded-xl space-y-4"
          style={{
            background: '#1E1E1E',
            border: '1px solid #282828',
            borderLeft: '4px solid #FF3B00',
          }}
        >
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#FF3B00]" />
              <h2 className="font-display text-base font-semibold text-white">
                4. Core Takeaways Box Builder
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddTakeaway}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#FF3B00] bg-[#FF3B00]/10 hover:bg-[#FF3B00]/20 border border-[#FF3B00]/25 transition-all cursor-pointer"
            >
              <Plus size={12} /> Add Takeaway
            </button>
          </div>

          <p className="text-xs text-[#888]">
            These points appear prominently in the orange-bordered elevated box right before the body.
          </p>

          <div className="space-y-3">
            {takeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white bg-[#141414] border border-[#FF3B00]/40 mt-1">
                  0{idx + 1}
                </span>
                <textarea
                  rows={2}
                  value={takeaway}
                  onChange={(e) => handleUpdateTakeaway(idx, e.target.value)}
                  placeholder={`Takeaway ${idx + 1}...`}
                  className="flex-1 px-3 py-2 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none leading-relaxed"
                />
                {takeaways.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(idx)}
                    className="p-2 text-[#666] hover:text-red-400 transition-colors mt-1"
                    title="Delete takeaway"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── SECTION 5: Rich Article Body Builder ──────────────────── */}
        <section
          className="p-6 sm:p-7 rounded-xl space-y-6"
          style={{
            background: '#1E1E1E',
            border: '1px solid #282828',
          }}
        >
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#FF3B00]" />
              <h2 className="font-display text-base font-semibold text-white">
                5. Rich Article Body & Sections
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#FF3B00] hover:bg-[#e03400] transition-all cursor-pointer"
            >
              <Plus size={13} /> Add Body Section
            </button>
          </div>

          {/* Intro Text Block */}
          <div>
            <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
              Introduction Paragraphs (Double enter between paragraphs)
            </label>
            <textarea
              rows={4}
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="First paragraph gets styled with a bold drop-cap on the reader page..."
              className="w-full px-4 py-2.5 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none leading-relaxed font-normal"
            />
          </div>

          {/* Dynamic Sections */}
          <div className="space-y-6 pt-2">
            {sections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-lg bg-[#161616] border border-[#262626] space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#FF3B00] font-semibold">
                    Section {sIdx + 1}
                  </span>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sIdx)}
                      className="text-xs text-[#666] hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={13} /> Remove Section
                    </button>
                  )}
                </div>

                {/* Section Heading & Subheading */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.68rem] font-mono text-[#777] uppercase mb-1">
                      Section Heading (H2)
                    </label>
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => handleUpdateSection(sIdx, { heading: e.target.value })}
                      placeholder="e.g. 1. The Baltimore Grassroots Miracle"
                      className="w-full px-3 py-2 rounded bg-[#1F1F1F] text-sm text-white font-medium border border-[#2A2A2A] outline-none focus:border-[#FF3B00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.68rem] font-mono text-[#777] uppercase mb-1">
                      Subheading / Hook (H3)
                    </label>
                    <input
                      type="text"
                      value={section.subheading || ''}
                      onChange={(e) => handleUpdateSection(sIdx, { subheading: e.target.value })}
                      placeholder="e.g. Why standard playbooks failed"
                      className="w-full px-3 py-2 rounded bg-[#1F1F1F] text-xs sm:text-sm text-white border border-[#2A2A2A] outline-none"
                    />
                  </div>
                </div>

                {/* Body Paragraphs */}
                <div>
                  <label className="block text-[0.68rem] font-mono text-[#777] uppercase mb-1">
                    Body Text (Separate paragraphs with double Enter)
                  </label>
                  <textarea
                    rows={4}
                    value={section.body.join('\n\n')}
                    onChange={(e) =>
                      handleUpdateSection(sIdx, {
                        body: e.target.value.split('\n\n').filter(Boolean),
                      })
                    }
                    placeholder="Enter detailed analysis..."
                    className="w-full px-3 py-2 rounded bg-[#1F1F1F] text-xs sm:text-sm text-white border border-[#2A2A2A] outline-none leading-relaxed"
                  />
                </div>

                {/* Optional Quote Block */}
                <div className="p-3.5 rounded bg-[#131313] border border-[#222] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#888]">
                    <Quote size={13} className="text-[#FF3B00]" />
                    <span>Quote Block (Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={section.quote?.text || ''}
                    onChange={(e) =>
                      handleUpdateSection(sIdx, {
                        quote: {
                          text: e.target.value,
                          author: section.quote?.author || 'Campaign Insider',
                        },
                      })
                    }
                    placeholder="Quote text..."
                    className="w-full px-3 py-1.5 rounded bg-[#1B1B1B] text-xs text-white border border-[#282828] outline-none italic"
                  />
                  <input
                    type="text"
                    value={section.quote?.author || ''}
                    onChange={(e) =>
                      handleUpdateSection(sIdx, {
                        quote: {
                          text: section.quote?.text || '',
                          author: e.target.value,
                        },
                      })
                    }
                    placeholder="Quote attribution (e.g. CMO of Nike)"
                    className="w-full px-3 py-1.5 rounded bg-[#1B1B1B] text-xs text-[#A0A0A0] border border-[#282828] outline-none font-mono"
                  />
                </div>

                {/* Optional Callout / Stat Box */}
                <div>
                  <label className="block text-[0.68rem] font-mono text-[#777] uppercase mb-1">
                    Key Highlight / Callout Box (Optional)
                  </label>
                  <input
                    type="text"
                    value={section.callout || ''}
                    onChange={(e) => handleUpdateSection(sIdx, { callout: e.target.value })}
                    placeholder="e.g. Key Insight: Speed of cultural relevance consistently beats high-budget perfection."
                    className="w-full px-3 py-1.5 rounded bg-[#1F1F1F] text-xs text-neutral-200 border border-[#2A2A2A] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="pt-4 border-t border-[#262626]">
            <label className="block text-xs font-mono text-[#888] uppercase mb-1.5">
              Conclusion / The Bottom Line
            </label>
            <textarea
              rows={3}
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              placeholder="Final takeaway for marketers..."
              className="w-full px-4 py-2.5 rounded bg-[#141414] text-xs sm:text-sm text-white border border-[#2A2A2A] focus:border-[#FF3B00] outline-none italic leading-relaxed"
            />
          </div>
        </section>

        {/* ─── SECTION 6: Slide Deck Carousel Builder (Optional) ────── */}
        <section
          className="p-6 sm:p-7 rounded-xl space-y-4"
          style={{
            background: '#1E1E1E',
            border: '1px solid #282828',
          }}
        >
          <div className="flex items-center justify-between border-b border-[#282828] pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-[#FF3B00]" />
              <h2 className="font-display text-base font-semibold text-white">
                6. Interactive Slide Deck Carousel (Optional)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#FF3B00] bg-[#FF3B00]/10 hover:bg-[#FF3B00]/20 border border-[#FF3B00]/25 transition-all cursor-pointer"
            >
              <Plus size={12} /> Add Slide
            </button>
          </div>

          <p className="text-xs text-[#888]">
            Renders an interactive swipeable deck directly inside the article body with live slide indicators.
          </p>

          <div className="space-y-4">
            {slides.map((slide, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-[#141414] border border-[#262626] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#FF3B00] font-semibold">
                    Slide 0{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(i)}
                    className="text-xs text-[#666] hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={13} /> Remove Slide
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.65rem] font-mono text-[#777] uppercase mb-1">
                      Slide Title
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(i, { title: e.target.value })}
                      placeholder="e.g. Slide 01: The Problem"
                      className="w-full px-2.5 py-1.5 rounded bg-[#1C1C1C] text-xs text-white border border-[#282828] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] font-mono text-[#777] uppercase mb-1">
                      Subtitle / Headline
                    </label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => handleUpdateSlide(i, { subtitle: e.target.value })}
                      placeholder="e.g. Unmet tension"
                      className="w-full px-2.5 py-1.5 rounded bg-[#1C1C1C] text-xs text-white border border-[#282828] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.65rem] font-mono text-[#777] uppercase mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={slide.imageUrl}
                    onChange={(e) => handleUpdateSlide(i, { imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded bg-[#1C1C1C] text-xs text-white border border-[#282828] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[0.65rem] font-mono text-[#777] uppercase mb-1">
                    Caption / Notes
                  </label>
                  <input
                    type="text"
                    value={slide.caption}
                    onChange={(e) => handleUpdateSlide(i, { caption: e.target.value })}
                    placeholder="Key takeaway of this slide..."
                    className="w-full px-2.5 py-1.5 rounded bg-[#1C1C1C] text-xs text-neutral-300 border border-[#282828] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Bottom Floating Action Bar ────────────────────────────── */}
        <div
          className="sticky bottom-6 p-4 rounded-xl flex items-center justify-between gap-4 z-30"
          style={{
            background: 'rgba(26,26,26,0.96)',
            backdropFilter: 'blur(16px)',
            border: '1px solid #333',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(255,59,0,0.15)',
          }}
        >
          <div className="flex items-center gap-2 text-xs text-[#888] font-mono hidden sm:flex">
            <span>Status:</span>
            <span className={status === 'draft' ? 'text-yellow-400' : 'text-green-400'}>
              {status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded text-xs font-mono text-[#A0A0A0] hover:text-white bg-[#141414] border border-[#282828] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="px-4 py-2 rounded text-xs font-semibold text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/25 transition-colors cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="px-6 py-2 rounded text-xs font-semibold text-white bg-[#FF3B00] hover:bg-[#e03400] shadow-[0_0_15px_rgba(255,59,0,0.4)] transition-colors cursor-pointer"
            >
              Publish Post
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
