import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Search, Menu, X, ChevronLeft, ChevronRight, ArrowRight,
  Play, Clock, Mail
} from 'lucide-react'
import { useArticles } from './articleStorage'
import { useTaxonomy } from './taxonomyStorage'
import { articleHasTag, normalizeTagName } from './taxonomy'
import { ArticlePage } from './ArticlePage'
import { Article } from './types'

// ─── Constants ─────────────────────────────────────────────────────────────

const FALLBACK_CATEGORY_COLORS: Record<string, string> = {
  Celebrity: '#9333EA',
  Business:  '#0EA5E9',
  Sports:    '#22C55E',
  'PR Stunt':'#F59E0B',
  Brands:    '#FF3B00',
}

function matchesCategory(article: Article, activeCategory: string): boolean {
  if (activeCategory === 'All') return true
  return (article.category || '').trim().toLowerCase() === activeCategory.trim().toLowerCase()
}

function matchesSearch(article: Article, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    article.title,
    article.summary,
    article.category,
    ...(article.tags || []),
    ...(article.keyTakeaways || []),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

function filterArticles(
  articles: Article[],
  activeCategory: string,
  activeTag: string,
  searchQuery: string
): Article[] {
  return articles.filter(
    (a) =>
      matchesCategory(a, activeCategory) &&
      (activeTag === 'All' || articleHasTag(a, activeTag)) &&
      matchesSearch(a, searchQuery)
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function CategoryTag({ label, color }: { label: string; color?: string }) {
  const resolved = color || FALLBACK_CATEGORY_COLORS[label] || '#FF3B00'
  return (
    <span
      className="tag-chip"
      style={{
        backgroundColor: `${resolved}12`,
        color: resolved,
        border: `1px solid ${resolved}22`,
      }}
    >
      {label}
    </span>
  )
}

function Header({
  menuOpen,
  setMenuOpen,
  onResetToHome,
  searchQuery,
  setSearchQuery,
}: {
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
  onResetToHome: () => void
  searchQuery: string
  setSearchQuery: (v: string) => void
}) {
  const [searchOpen, setSearchOpen] = useState(Boolean(searchQuery))

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(18,18,18,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #202020',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-15 flex items-center gap-6" style={{ height: '60px' }}>
        {/* Logo */}
        <button
          type="button"
          onClick={onResetToHome}
          className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer bg-transparent border-0 text-left focus:outline-none"
        >
          <img
            src="/assets/FGA%20logo%20transparent%20whiteorange.png"
            alt="FGA Logo"
            className="w-7 h-7 object-contain"
          />
          <span
            className="font-display text-white hidden sm:block"
            style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.02em' }}
          >
            Finding Good Ads
          </span>
          <span className="font-display text-white sm:hidden" style={{ fontWeight: 600, fontSize: '1.1rem' }}>
            FGA
          </span>
        </button>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-7 ml-4">
          <a href="#breakdowns" className="nav-link text-sm font-medium">
            Breakdowns
          </a>
          <a href="#carousels" className="nav-link text-sm font-medium">
            Carousels
          </a>
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center">
          {searchOpen || searchQuery ? (
            <div
              className="flex items-center gap-2 px-3 py-2 w-56 rounded-sm"
              style={{ background: '#1A1A1A', border: '1px solid #252525' }}
            >
              <Search size={13} color="#606060" />
              <input
                autoFocus={!searchQuery}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="bg-transparent text-sm text-white placeholder-gray-700 outline-none w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('')
                    setSearchOpen(false)
                  }
                }}
              />
              {(searchQuery || searchOpen) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchOpen(false)
                  }}
                  className="text-[#666] hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-sm text-gray-500 hover:text-gray-300 transition-colors md:hidden cursor-pointer"
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden" style={{ borderTop: '1px solid #1e1e1e', background: '#121212' }}>
          <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-4">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-sm"
              style={{ background: '#1A1A1A', border: '1px solid #252525' }}
            >
              <Search size={13} color="#606060" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns..."
                className="bg-transparent text-sm text-white placeholder-gray-700 outline-none w-full"
              />
            </div>
            <a
              href="#breakdowns"
              className="text-sm font-medium py-1"
              style={{ color: '#A0A0A0' }}
              onClick={() => setMenuOpen(false)}
            >
              Breakdowns
            </a>
            <a
              href="#carousels"
              className="text-sm font-medium py-1"
              style={{ color: '#A0A0A0' }}
              onClick={() => setMenuOpen(false)}
            >
              Carousels
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function HeroSection({
  heroArticle,
  onSelectArticle,
}: {
  heroArticle: Article
  onSelectArticle: (slug: string) => void
}) {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 pb-6">
      {/* Split Hero */}
      <div
        onClick={() => onSelectArticle(heroArticle.id)}
        className="rounded-lg overflow-hidden cursor-pointer group transition-all duration-300"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          background: '#1A1A1A',
          border: '1px solid #222',
          boxShadow: '4px 4px 14px #0a0a0a, -2px -2px 8px #242424',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#333'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#222'
        }}
      >
        {/* Left */}
        <div className="p-8 lg:p-11 flex flex-col justify-between" style={{ minHeight: '400px' }}>
          <div>
            <span
              className="tag-chip inline-block mb-5"
              style={{ background: 'rgba(255,59,0,0.08)', color: '#FF3B00', border: '1px solid rgba(255,59,0,0.18)' }}
            >
              Featured Breakdown
            </span>
            <h1
              className="font-display text-white mb-4 group-hover:text-[#FF3B00] transition-colors"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.9rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.12 }}
            >
              {heroArticle.title}
            </h1>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#787878', maxWidth: '40ch' }}>
              {heroArticle.summary}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSelectArticle(heroArticle.id)
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white self-start transition-colors cursor-pointer"
            style={{ background: '#FF3B00' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e03400')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#FF3B00')}
          >
            <Clock size={12} />
            {heroArticle.readTime}
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Right — Image */}
        <div className="relative overflow-hidden" style={{ minHeight: '360px', background: '#161616' }}>
          <img
            src={heroArticle.heroImage}
            alt={heroArticle.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'brightness(0.8)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgba(26,26,26,0.35) 0%, transparent 45%)' }}
          />
          <div className="absolute bottom-4 right-4">
            <span
              className="tag-chip"
              style={{
                background: 'rgba(0,0,0,0.6)',
                color: '#ccc',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {heroArticle.category} Breakdown
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function PublicFiltersBar({
  categories,
  tags,
  activeCategory,
  setActiveCategory,
  activeTag,
  setActiveTag,
  resultCount,
  totalCount,
}: {
  categories: string[]
  tags: string[]
  activeCategory: string
  setActiveCategory: (v: string) => void
  activeTag: string
  setActiveTag: (v: string) => void
  resultCount: number
  totalCount: number
}) {
  const hasFilters = activeCategory !== 'All' || activeTag !== 'All'

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-2">
      <div
        className="rounded-lg p-4"
        style={{ background: '#1A1A1A', border: '1px solid #222' }}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="font-mono text-xs text-[#666] uppercase tracking-wider">Filter campaigns</p>
          <p className="font-mono text-xs text-[#555]">
            {resultCount}
            {hasFilters ? ` of ${totalCount}` : ''} campaigns
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="tag-chip cursor-pointer"
                style={{
                  background: active ? 'rgba(255,59,0,0.12)' : 'rgba(255,255,255,0.03)',
                  color: active ? '#FF3B00' : '#686868',
                  border: `1px solid ${active ? 'rgba(255,59,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  padding: '6px 12px',
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="flex items-center gap-2 min-w-0 sm:ml-auto">
            <span className="font-mono text-[0.65rem] uppercase text-[#555] shrink-0">Tag</span>
            <select
              aria-label="Filter by tag"
              value={activeTag}
              onChange={(e) => setActiveTag(e.target.value)}
              className="h-9 min-w-[160px] max-w-full px-3 rounded-md bg-[#141414] text-sm text-white border border-[#282828] focus:border-[#FF3B00] outline-none cursor-pointer"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === 'All' ? 'All tags' : tag}
                </option>
              ))}
            </select>
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All')
                setActiveTag('All')
              }}
              className="text-xs text-[#888] hover:text-[#FF3B00] cursor-pointer sm:shrink-0"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function CarouselsSection({
  carouselArticles,
  onSelectArticle,
}: {
  carouselArticles: Article[]
  onSelectArticle: (id: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (ref.current) ref.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  if (carouselArticles.length === 0) return null

  return (
    <section id="carousels" className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: '#FF3B00' }}>01</span>
          <h2 className="font-display text-white" style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Interactive Slide Decks
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-sm transition-colors cursor-pointer"
            style={{ color: '#505050', background: '#1A1A1A', border: '1px solid #222' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ccc')}
            onMouseLeave={e => (e.currentTarget.style.color = '#505050')}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-sm transition-colors cursor-pointer"
            style={{ color: '#505050', background: '#1A1A1A', border: '1px solid #222' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ccc')}
            onMouseLeave={e => (e.currentTarget.style.color = '#505050')}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div ref={ref} className="flex gap-3.5 overflow-x-auto scroll-hide pb-1">
        {carouselArticles.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectArticle(card.id)}
            className="flex-shrink-0 cursor-pointer group"
            style={{
              width: '280px',
              background: '#1A1A1A',
              border: '1px solid #222',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '3px 3px 10px #0a0a0a',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#2e2e2e'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '4px 4px 14px #080808'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#222'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '3px 3px 10px #0a0a0a'
            }}
          >
            <div className="relative overflow-hidden" style={{ height: '170px', background: '#161616' }}>
              <img
                src={card.heroImage}
                alt={card.title}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.75)', transition: 'transform 0.5s ease' }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.75) 0%, transparent 55%)' }}
              />
              <div className="absolute bottom-3 left-3">
                <CategoryTag label={card.category} />
              </div>
              <div
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ transitionDuration: '0.2s' }}
              >
                <div
                  className="w-7 h-7 rounded-sm flex items-center justify-center"
                  style={{ background: '#FF3B00' }}
                >
                  <Play size={11} fill="white" color="white" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="font-mono text-xs mb-1.5" style={{ color: '#505050' }}>
                {card.slides?.length || 4} slides · {card.readTime}
              </p>
              <h3 className="font-display text-white leading-snug group-hover:text-[#FF3B00] transition-colors line-clamp-2" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BreakdownsGrid({
  articles,
  onSelectArticle,
  isFiltered,
}: {
  articles: Article[]
  onSelectArticle: (id: string) => void
  isFiltered: boolean
}) {
  return (
    <section id="breakdowns" className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs" style={{ color: '#FF3B00' }}>02</span>
          <h2 className="font-display text-white" style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
            All Breakdowns
          </h2>
        </div>
        <span className="font-mono text-xs text-[#555]">{articles.length} shown</span>
      </div>

      {articles.length === 0 ? (
        <div
          className="rounded-lg px-6 py-14 text-center"
          style={{ background: '#1A1A1A', border: '1px solid #222' }}
        >
          <p className="font-display text-white text-lg mb-2">
            {isFiltered ? 'No campaigns match these filters' : 'No campaigns yet'}
          </p>
          <p className="text-sm text-[#777]">
            {isFiltered
              ? 'Try another category or tag, or clear filters.'
              : 'Published posts from the CMS will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((card) => (
            <article
              key={card.id}
              onClick={() => onSelectArticle(card.id)}
              className="cursor-pointer group flex flex-col justify-between"
              style={{
                background: '#1A1A1A',
                border: '1px solid #222',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '3px 3px 10px #0a0a0a',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#2e2e2e'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#222'
                ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              }}
            >
              <div className="relative overflow-hidden" style={{ height: '175px', background: '#161616' }}>
                <img
                  src={card.heroImage}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: 'brightness(0.75)' }}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-2.5">
                    <CategoryTag label={card.category} />
                  </div>
                  <h3
                    className="font-display text-white leading-snug mb-3 line-clamp-2 group-hover:text-[#FF3B00] transition-colors"
                    style={{ fontSize: '1rem', fontWeight: 500 }}
                  >
                    {card.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#222]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} color="#505050" />
                    <span className="font-mono text-xs" style={{ color: '#505050' }}>
                      {card.readTime}
                    </span>
                  </div>
                  <span className="font-mono text-[0.7rem] text-[#666] group-hover:text-white transition-colors">
                    Read →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function NewsletterBox() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const handleJoin = () => {
    if (email.includes('@')) setJoined(true)
  }

  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <div
        className="rounded-lg p-8 lg:p-12"
        style={{
          background: '#181818',
          border: '1px solid #202020',
          boxShadow: 'inset 3px 3px 12px #0e0e0e, inset -2px -2px 8px #222',
        }}
      >
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Mail size={12} color="#FF3B00" />
            <span className="font-mono text-xs" style={{ color: '#FF3B00', letterSpacing: '0.06em' }}>THE FGA LETTER</span>
          </div>
          <h2
            className="font-display text-white mb-3"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            The letter marketers actually finish reading
          </h2>
          <p className="text-sm mb-7" style={{ color: '#686868' }}>
            One ad breakdown, every Thursday. No filler, no brand-speak.
            Join 14,000 readers who opened last week.
          </p>

          {joined ? (
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm"
              style={{ background: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.18)' }}
            >
              ✓ You're in. Check your inbox.
            </div>
          ) : (
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                className="flex-1 px-4 py-2.5 rounded-sm text-sm text-white outline-none"
                style={{
                  background: '#131313',
                  border: '1px solid #252525',
                  color: '#ccc',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#333')}
                onBlur={e => (e.currentTarget.style.borderColor = '#252525')}
              />
              <button
                onClick={handleJoin}
                className="flex-shrink-0 px-5 py-2.5 rounded-sm text-sm font-medium text-white transition-colors cursor-pointer"
                style={{ background: '#FF3B00' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e03400')}
                onMouseLeave={e => (e.currentTarget.style.background = '#FF3B00')}
              >
                Join
              </button>
            </div>
          )}
          <p className="mt-3.5 text-xs" style={{ color: '#383838' }}>No spam. Unsubscribe in one click.</p>
        </div>
      </div>
    </section>
  )
}

function GetFeaturedBanner() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <div
        className="rounded-lg px-8 py-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{
          background: '#1A1A1A',
          border: '1px solid #222',
          boxShadow: '3px 3px 10px #0a0a0a',
        }}
      >
        <div>
          <span className="font-mono text-xs block mb-2" style={{ color: '#FF3B00', letterSpacing: '0.06em' }}>PARTNER WITH US</span>
          <h3
            className="font-display text-white"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Get your campaign featured on Finding Good Ads
          </h3>
          <p className="text-sm mt-1.5" style={{ color: '#686868' }}>
            Reach 14,000+ marketers who care about craft. Pitch your campaign and we’ll review it for a feature.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex-shrink-0 px-6 py-2.5 rounded-sm text-sm font-medium text-white transition-colors cursor-pointer"
            style={{ background: '#FF3B00', whiteSpace: 'nowrap' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e03400')}
            onMouseLeave={e => (e.currentTarget.style.background = '#FF3B00')}
          >
            Work with us
          </button>
        </div>
      </div>
    </section>
  )
}

function Footer({
  onResetToHome,
}: {
  onResetToHome: () => void
}) {
  return (
    <footer style={{ borderTop: '1px solid #1E1E1E' }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div>
            <button
              onClick={onResetToHome}
              className="flex items-center gap-2 mb-3 cursor-pointer bg-transparent border-0 text-left focus:outline-none"
            >
              <img 
                src="/assets/FGA%20logo%20transparent%20whiteorange.png" 
                alt="FGA Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-display text-white" style={{ fontWeight: 600, fontSize: '1rem' }}>Finding Good Ads</span>
            </button>
            <p className="text-sm leading-relaxed" style={{ color: '#505050' }}>
              Deep dives into the ads that actually worked — and why.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs mb-4" style={{ color: '#303030', letterSpacing: '0.06em' }}>EXPLORE</p>
            <div className="flex flex-col gap-2.5">
              <a href="#breakdowns" className="text-sm text-[#505050] hover:text-[#ccc] transition-colors">
                Breakdowns
              </a>
              <a href="#carousels" className="text-sm text-[#505050] hover:text-[#ccc] transition-colors">
                Carousels
              </a>
            </div>
          </div>
          <div>
            <p className="font-mono text-xs mb-4" style={{ color: '#303030', letterSpacing: '0.06em' }}>COMPANY</p>
            <div className="flex flex-col gap-2.5">
              {['About', 'Work with Us', 'Privacy Policy', 'Twitter / X'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="text-sm transition-colors"
                  style={{ color: '#505050' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ccc')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#505050')}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid #1A1A1A' }}
        >
          <span className="font-mono text-xs" style={{ color: '#303030' }}>
            © 2024 Finding Good Ads. All rights reserved.
          </span>
          <span className="font-mono text-xs" style={{ color: '#303030' }}>
            Made for marketers who give a damn.
          </span>
        </div>
      </div>
    </footer>
  )
}

// ─── Public site (no admin entry points) ────────────────────────────────────

function isPublished(article: Article): boolean {
  return (article.status || 'published') === 'published'
}

export function HomePage() {
  const { articles, articlesList, loading, error } = useArticles()
  const { categories: taxonomyCategories, tags: taxonomyTags } = useTaxonomy()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTag, setActiveTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Ignore legacy #admin hashes — public users must never land in CMS via hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#admin')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  const publishedArticles = articlesList.filter(isPublished)

  // Only offer filters that actually have published posts
  const usedCategories = Array.from(
    new Set(publishedArticles.map((a) => a.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  const categoryFilters = [
    'All',
    ...Array.from(
      new Set([
        ...usedCategories,
        // Keep taxonomy names that match a used category (for stable ordering via taxonomy)
        ...taxonomyCategories.map((c) => c.name).filter((name) =>
          usedCategories.some((u) => u.toLowerCase() === name.toLowerCase())
        ),
      ])
    ).sort((a, b) => a.localeCompare(b)),
  ]

  const usedTags = Array.from(
    new Set(publishedArticles.flatMap((a) => (a.tags || []).map(normalizeTagName)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b))

  const tagFilters = [
    'All',
    ...Array.from(
      new Set([
        ...usedTags,
        ...taxonomyTags
          .map((t) => normalizeTagName(t.name))
          .filter((name) => usedTags.some((u) => u.toLowerCase() === name.toLowerCase())),
      ])
    ).sort((a, b) => a.localeCompare(b)),
  ]

  const filteredArticles = filterArticles(
    publishedArticles,
    activeCategory,
    activeTag,
    searchQuery
  )
  const carouselArticles = filteredArticles.filter((a) => a.slides && a.slides.length > 0)
  const isFiltered =
    activeCategory !== 'All' || activeTag !== 'All' || searchQuery.trim().length > 0

  const heroArticle = (articles['nike-af1'] && isPublished(articles['nike-af1'])
    ? articles['nike-af1']
    : publishedArticles[0]) as Article | undefined

  const navigateToArticle = (id: string) => {
    navigate(`/article/${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToHome = () => {
    setActiveCategory('All')
    setActiveTag('All')
    setSearchQuery('')
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && publishedArticles.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#888] flex items-center justify-center font-mono text-sm">
        Loading campaigns…
      </div>
    )
  }

  if (error && publishedArticles.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center gap-3 px-4">
        <h1 className="font-display text-xl font-semibold">Couldn’t load campaigns</h1>
        <p className="text-sm text-[#888] text-center max-w-md">{error}</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#121212', minHeight: '100vh' }}>
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onResetToHome={navigateToHome}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main>
        {heroArticle && (
          <HeroSection heroArticle={heroArticle} onSelectArticle={navigateToArticle} />
        )}
        <PublicFiltersBar
          categories={categoryFilters}
          tags={tagFilters}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          resultCount={filteredArticles.length}
          totalCount={publishedArticles.length}
        />
        <CarouselsSection
          carouselArticles={carouselArticles}
          onSelectArticle={navigateToArticle}
        />
        <BreakdownsGrid
          articles={filteredArticles}
          onSelectArticle={navigateToArticle}
          isFiltered={isFiltered}
        />
        <NewsletterBox />
        <GetFeaturedBanner />
      </main>
      <Footer onResetToHome={navigateToHome} />
    </div>
  )
}

export function PublicArticlePage() {
  const { articleId } = useParams<{ articleId: string }>()
  const { articles, articlesList, loading } = useArticles()
  const navigate = useNavigate()

  const publishedArticles = articlesList.filter(isPublished)
  const article = articleId ? articles[articleId] : null

  if (loading && !article) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#888] flex items-center justify-center font-mono text-sm">
        Loading article…
      </div>
    )
  }

  if (!article || !isPublished(article)) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-2xl font-semibold">Article not found</h1>
        <p className="text-sm text-[#888]">This breakdown isn’t available on the public site.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded text-sm font-semibold bg-[#FF3B00] hover:bg-[#e03400] cursor-pointer"
        >
          Back to home
        </button>
      </div>
    )
  }

  return (
    <ArticlePage
      article={article}
      allArticles={publishedArticles}
      onBackToHome={() => navigate('/')}
      onSelectArticle={(id) => navigate(`/article/${id}`)}
    />
  )
}

