import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Search,
  Menu,
  X,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Heart,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Edit3,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react'
import { Article } from './types'

interface ArticlePageProps {
  article: Article
  allArticles?: Article[]
  onBackToHome: () => void
  onSelectArticle: (articleId: string) => void
  onSelectTag?: (tag: string) => void
  isAdmin?: boolean
  onEditArticle?: (articleId: string) => void
  onOpenAdmin?: () => void
}

const CATEGORY_COLORS: Record<string, string> = {
  Celebrity: '#9333EA',
  Business: '#0EA5E9',
  Sports: '#22C55E',
  'PR Stunt': '#F59E0B',
  Brands: '#FF3B00',
}

export function ArticlePage({
  article,
  allArticles = [],
  onBackToHome,
  onSelectArticle,
  onSelectTag,
  isAdmin = false,
  onEditArticle,
  onOpenAdmin,
}: ArticlePageProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(524)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [newsletterJoined, setNewsletterJoined] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActiveSlide(0)
    setLiked(false)
    setBookmarked(false)
  }, [article.id])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  const handleCopyLink = () => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
    }
    setCopied(true)
    showToast('Article URL copied to clipboard!')
    setTimeout(() => setCopied(false), 2200)
  }

  const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Breakdown: ${article.title} via @FindingGoodAds`)
    let target = ''

    if (platform === 'twitter') {
      target = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    } else if (platform === 'linkedin') {
      target = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    } else if (platform === 'whatsapp') {
      target = `https://api.whatsapp.com/send?text=${text}%20${url}`
    }

    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer')
    }
  }

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false)
      setLikeCount((c) => c - 1)
    } else {
      setLiked(true)
      setLikeCount((c) => c + 1)
      showToast('Added to your favorite breakdowns!')
    }
  }

  const handleToggleBookmark = () => {
    const nextState = !bookmarked
    setBookmarked(nextState)
    showToast(nextState ? 'Saved for later reading!' : 'Removed from bookmarks')
  }

  // Related articles (filter out current article)
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 3)

  const categoryColor = CATEGORY_COLORS[article.category] || '#FF3B00'
  const slides = article.slides || []
  const hasStats = article.stats && article.stats.length > 0
  const hasTakeaways = article.keyTakeaways && article.keyTakeaways.length > 0
  const isDraft = article.status === 'draft'

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-[#FF3B00]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-md bg-[#1E1E1E] text-white text-sm border border-[#FF3B00]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-[#FF3B00] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── Top Admin Bar (When in Admin Mode) ────────────────────── */}
      {isAdmin && (
        <div
          className="w-full bg-[#181818] border-b border-[#282828] px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-mono"
          style={{ background: 'linear-gradient(90deg, #181818 0%, #1e1e1e 100%)' }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 text-[#FF3B00] font-semibold">
              <Shield size={13} />
              <span>ADMIN MODE</span>
            </span>
            <span className="text-[#555]">|</span>
            {isDraft ? (
              <span className="text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/25">
                DRAFT POST
              </span>
            ) : (
              <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/25 flex items-center gap-1">
                <CheckCircle2 size={11} /> LIVE POST
              </span>
            )}
            <span className="text-[#666] hidden md:inline">ID: {article.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {onEditArticle && (
              <button
                onClick={() => onEditArticle(article.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF3B00] hover:bg-[#e03400] text-white font-semibold transition-all cursor-pointer shadow-[0_0_10px_rgba(255,59,0,0.3)]"
              >
                <Edit3 size={12} />
                <span>Edit This Post</span>
              </button>
            )}

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#141414] hover:bg-[#222] text-[#A0A0A0] hover:text-white border border-[#282828] transition-all cursor-pointer"
              >
                <Layers size={12} />
                <span className="hidden sm:inline">CMS Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Sticky Header ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: 'rgba(18,18,18,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #202020',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
          {/* Left: Logo & Back Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2.5 flex-shrink-0 group cursor-pointer focus:outline-none"
              title="Return to FGA Homepage"
            >
              <img
                src="/assets/FGA%20logo%20transparent%20whiteorange.png"
                alt="Finding Good Ads Logo"
                className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span
                className="font-display text-white hidden sm:block tracking-tight text-base font-semibold"
                style={{ letterSpacing: '-0.02em' }}
              >
                Finding Good Ads
              </span>
            </button>

            <div className="h-5 w-[1px] bg-[#2A2A2A] hidden sm:block" />

            {/* Back Button */}
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#A0A0A0] hover:text-[#FF3B00] px-3 py-1.5 rounded-sm transition-all duration-200 hover:bg-[#1A1A1A] border border-transparent hover:border-[#282828] cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Back to Breakdowns</span>
            </button>
          </div>

          {/* Right: Search, Admin Shortcut, Mobile Menu */}
          <div className="flex items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#FF3B00] bg-[#FF3B00]/10 hover:bg-[#FF3B00]/20 border border-[#FF3B00]/25 transition-all cursor-pointer"
                title="Open CMS Studio"
              >
                <Shield size={12} />
                <span>Admin CMS</span>
              </button>
            )}

            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 w-44 sm:w-56 rounded-sm"
                  style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                >
                  <Search size={14} className="text-[#A0A0A0]" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search breakdowns..."
                    className="bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 outline-none w-full"
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-sm text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E] transition-colors cursor-pointer"
                  title="Search breakdowns"
                >
                  <Search size={17} />
                </button>
              )}
            </div>

            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-sm text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E] transition-colors md:hidden cursor-pointer"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#1E1E1E] bg-[#121212] px-5 py-4 space-y-3">
            <button
              onClick={() => {
                setMenuOpen(false)
                onBackToHome()
              }}
              className="w-full text-left text-sm text-[#A0A0A0] hover:text-white py-1 flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </button>
            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onOpenAdmin()
                }}
                className="w-full text-left text-sm text-[#FF3B00] py-1 flex items-center gap-2 font-mono"
              >
                <Shield size={14} /> Open Admin CMS Studio
              </button>
            )}
          </div>
        )}
      </header>

      {/* ─── Main Article Container ─────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-[#A0A0A0] mb-6 flex-wrap">
          <button
            onClick={onBackToHome}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={onBackToHome}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Breakdowns
          </button>
          <span>/</span>
          <span
            className="font-semibold tracking-wide uppercase px-2 py-0.5 rounded text-[0.68rem]"
            style={{
              color: categoryColor,
              backgroundColor: `${categoryColor}15`,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            {article.category}
          </span>
        </nav>

        {/* Article Title (H1) */}
        <h1
          className="font-display text-white text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] mb-6"
          style={{ letterSpacing: '-0.025em' }}
        >
          {article.title}
        </h1>

        {/* Article Summary Lead */}
        <p className="text-base sm:text-lg text-[#A0A0A0] leading-relaxed mb-7 font-light">
          {article.summary}
        </p>

        {/* Meta Bar */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg mb-8"
          style={{
            background: '#1A1A1A',
            border: '1px solid #242424',
            boxShadow: '3px 3px 10px #0a0a0a, -2px -2px 8px #222222',
          }}
        >
          {/* Author & Published Info */}
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face&auto=format'}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border border-[#333]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{article.author.name}</span>
                {article.author.handle && (
                  <span className="text-xs font-mono text-[#666] hidden sm:inline">
                    {article.author.handle}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#A0A0A0] mt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar size={12} className="text-[#FF3B00]" />
                  {article.publishedDate}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono text-[#FF3B00] bg-[#FF3B00]/10 px-2 py-0.5 rounded text-[0.7rem] font-medium border border-[#FF3B00]/25">
                  <Clock size={11} />
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
            <span className="text-xs font-mono text-[#777] hidden md:inline mr-1">SHARE:</span>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="p-2 rounded bg-[#181818] hover:bg-[#25D366]/10 text-[#A0A0A0] hover:text-[#25D366] border border-[#262626] hover:border-[#25D366]/30 transition-all cursor-pointer"
              title="Share on WhatsApp"
            >
              <MessageSquare size={14} />
            </button>

            {/* X / Twitter */}
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 rounded bg-[#181818] hover:bg-[#1DA1F2]/10 text-[#A0A0A0] hover:text-[#1DA1F2] border border-[#262626] hover:border-[#1DA1F2]/30 transition-all cursor-pointer"
              title="Share on X"
            >
              <span className="text-xs font-bold leading-none px-0.5">𝕏</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded bg-[#181818] hover:bg-[#0A66C2]/10 text-[#A0A0A0] hover:text-[#0A66C2] border border-[#262626] hover:border-[#0A66C2]/30 transition-all cursor-pointer"
              title="Share on LinkedIn"
            >
              <Share2 size={14} />
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer border ${
                copied
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'bg-[#181818] text-[#A0A0A0] hover:text-white border-[#262626] hover:border-[#383838]'
              }`}
              title="Copy Article URL"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Featured Hero Banner Image (16:9) */}
        <div
          className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-10"
          style={{
            background: '#181818',
            border: '1px solid #282828',
            boxShadow: '6px 6px 20px #080808, -3px -3px 12px #202020',
          }}
        >
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(18,18,18,0.7) 0%, transparent 60%)',
            }}
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="tag-chip text-white bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded">
              {article.category} Breakdown · Campaign Analysis
            </span>
          </div>
        </div>

        {/* Stats Grid (Dynamic) */}
        {hasStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            {article.stats!.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg text-center"
                style={{
                  background: '#1A1A1A',
                  border: '1px solid #242424',
                  boxShadow: '4px 4px 10px #090909, -2px -2px 6px #202020',
                }}
              >
                <div className="font-mono text-xs text-[#787878] uppercase tracking-wider mb-1">
                  {stat.label}
                </div>
                <div className="font-display text-2xl font-bold text-[#FF3B00]">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Key Takeaways Box (Dynamic) ───────────────────────────── */}
        {hasTakeaways && (
          <div
            className="rounded-lg p-6 sm:p-8 mb-12 relative overflow-hidden"
            style={{
              background: '#1E1E1E',
              border: '1px solid #2A2A2A',
              borderLeft: '5px solid #FF3B00',
              boxShadow: '5px 5px 15px #0a0a0a, -3px -3px 10px #242424',
            }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-[#FF3B00]/15 text-[#FF3B00]">
                <Sparkles size={14} />
              </div>
              <h3
                className="font-mono text-xs tracking-wider uppercase text-[#FF3B00] font-semibold"
                style={{ letterSpacing: '0.08em' }}
              >
                Key Campaign Takeaways
              </h3>
            </div>

            <div className="space-y-3.5">
              {article.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white bg-[#141414] border border-[#FF3B00]/40"
                    style={{ marginTop: '2px' }}
                  >
                    0{idx + 1}
                  </span>
                  <p className="text-sm text-neutral-200 leading-relaxed">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Formatted Body Text (Dynamic) ─────────────────────────── */}
        <article className="prose prose-invert max-w-none text-neutral-300 space-y-8 font-normal text-[1.05rem] leading-[1.8]">
          {/* Intro Paragraphs */}
          {article.content.intro && article.content.intro.length > 0 && (
            <div className="space-y-5">
              {article.content.intro.map((p, idx) => (
                <p key={idx} className="text-[#C8C8C8] leading-relaxed">
                  {idx === 0 ? (
                    <span className="float-left text-5xl font-display font-bold text-[#FF3B00] pr-3 leading-none pt-1">
                      {p.charAt(0)}
                    </span>
                  ) : null}
                  {idx === 0 ? p.slice(1) : p}
                </p>
              ))}
            </div>
          )}

          {/* ─── Interactive Slide/Carousel Embed (Dynamic) ─────────── */}
          {slides.length > 0 && (
            <div
              className="my-10 rounded-xl p-5 sm:p-6"
              style={{
                background: '#1A1A1A',
                border: '1px solid #282828',
                boxShadow: 'inset 2px 2px 6px #0d0d0d, inset -2px -2px 6px #242424',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3B00] animate-ping" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#FF3B00] font-semibold">
                    Interactive Slide Deck
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#888]">
                  <span>{activeSlide + 1}</span>
                  <span>/</span>
                  <span>{slides.length}</span>
                </div>
              </div>

              {/* Active Slide Viewer */}
              <div className="relative rounded-lg overflow-hidden bg-[#131313] border border-[#222]">
                <div className="aspect-[16/9] w-full overflow-hidden relative">
                  <img
                    src={slides[activeSlide]?.imageUrl}
                    alt={slides[activeSlide]?.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-mono text-xs text-[#FF3B00] font-semibold block mb-1">
                      {slides[activeSlide]?.title}
                    </span>
                    <h4 className="font-display text-white text-base sm:text-lg font-semibold mb-1">
                      {slides[activeSlide]?.subtitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2">
                      {slides[activeSlide]?.caption}
                    </p>
                  </div>
                </div>

                {/* Left/Right Slide Controls */}
                <button
                  onClick={() => setActiveSlide((curr) => (curr > 0 ? curr - 1 : slides.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#FF3B00] text-white border border-white/20 transition-all cursor-pointer"
                  title="Previous Slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveSlide((curr) => (curr < slides.length - 1 ? curr + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#FF3B00] text-white border border-white/20 transition-all cursor-pointer"
                  title="Next Slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Slide Thumbnails / Indicators */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === i ? 'w-8 bg-[#FF3B00]' : 'w-2 bg-[#333] hover:bg-[#555]'
                    }`}
                    title={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Content Sections */}
          {article.content.sections &&
            article.content.sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-5 pt-4">
                <h2
                  className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight pt-2"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {section.heading}
                </h2>

                {section.subheading && (
                  <h3 className="text-lg font-medium text-[#FF3B00] font-mono -mt-2">
                    {section.subheading}
                  </h3>
                )}

                {section.body &&
                  section.body.map((p, pIdx) => (
                    <p key={pIdx} className="text-[#C8C8C8] leading-relaxed">
                      {p}
                    </p>
                  ))}

                {/* Blockquote with Orange Accent Line */}
                {section.quote && section.quote.text && (
                  <blockquote
                    className="my-6 p-5 sm:p-6 rounded-r-lg"
                    style={{
                      background: '#1A1A1A',
                      borderLeft: '4px solid #FF3B00',
                      borderTop: '1px solid #242424',
                      borderRight: '1px solid #242424',
                      borderBottom: '1px solid #242424',
                    }}
                  >
                    <p className="text-lg sm:text-xl font-display italic text-white leading-snug mb-3">
                      "{section.quote.text}"
                    </p>
                    {section.quote.author && (
                      <footer className="font-mono text-xs text-[#FF3B00] font-semibold">
                        — {section.quote.author}
                      </footer>
                    )}
                  </blockquote>
                )}

                {/* Embedded Campaign Image */}
                {section.image && section.image.url && (
                  <figure className="my-7 rounded-xl overflow-hidden border border-[#252525] bg-[#161616]">
                    <img
                      src={section.image.url}
                      alt={section.image.caption || 'Campaign Visual'}
                      className="w-full h-auto object-cover max-h-[460px]"
                    />
                    {section.image.caption && (
                      <figcaption className="p-3 text-xs font-mono text-center text-[#888] bg-[#141414] border-t border-[#222]">
                        {section.image.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Bold Callout Card */}
                {section.callout && (
                  <div
                    className="p-4 sm:p-5 rounded-lg my-6 flex items-start gap-3.5"
                    style={{
                      background: 'rgba(255,59,0,0.06)',
                      border: '1px solid rgba(255,59,0,0.25)',
                    }}
                  >
                    <TrendingUp className="text-[#FF3B00] flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-neutral-200 font-medium leading-relaxed">
                      {section.callout}
                    </p>
                  </div>
                )}
              </div>
            ))}

          {/* Conclusion */}
          {article.content.conclusion && (
            <div className="pt-6 border-t border-[#222]">
              <h3 className="font-display text-xl font-semibold text-white mb-3">
                The Bottom Line
              </h3>
              <p className="text-[#C8C8C8] leading-relaxed italic">
                {article.content.conclusion}
              </p>
            </div>
          )}
        </article>

        {/* ─── Post-Article Engagement Bar ─────────────────────────────── */}
        <section className="mt-14 pt-8 border-t border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Interactive Tag Pills */}
          <div>
            <div className="text-xs font-mono text-[#777] uppercase tracking-wider mb-2.5">
              Related Topics
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (onSelectTag) onSelectTag(tag)
                    showToast(`Filtered by ${tag}`)
                  }}
                  className="tag-chip text-xs transition-all duration-200 cursor-pointer"
                  style={{
                    background: 'rgba(255,59,0,0.05)',
                    color: '#FF3B00',
                    border: '1px solid rgba(255,59,0,0.22)',
                    boxShadow: '2px 2px 6px #0a0a0a',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,59,0,0.15)'
                    e.currentTarget.style.borderColor = '#FF3B00'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,59,0,0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255,59,0,0.22)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Like & Bookmark Buttons */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium transition-all duration-200 cursor-pointer ${
                liked
                  ? 'bg-[#FF3B00] text-white shadow-[0_0_15px_rgba(255,59,0,0.4)]'
                  : 'bg-[#1A1A1A] text-[#A0A0A0] hover:text-white border border-[#282828] shadow-[3px_3px_8px_#090909,-2px_-2px_6px_#1f1f1f]'
              }`}
            >
              <Heart
                size={14}
                fill={liked ? 'currentColor' : 'none'}
                className={liked ? 'scale-110 transition-transform' : ''}
              />
              <span>{likeCount}</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs font-medium transition-all duration-200 cursor-pointer ${
                bookmarked
                  ? 'bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-[#1A1A1A] text-[#A0A0A0] hover:text-white border border-[#282828] shadow-[3px_3px_8px_#090909,-2px_-2px_6px_#1f1f1f]'
              }`}
            >
              <Bookmark size={14} fill={bookmarked ? 'currentColor' : 'none'} />
              <span>{bookmarked ? 'Saved' : 'Save for later'}</span>
            </button>
          </div>
        </section>

        {/* ─── Related / More Breakdowns Section (Dynamic) ─────────────── */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#202020]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#FF3B00]">02</span>
                <h2
                  className="font-display text-white text-2xl font-bold tracking-tight"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  More Breakdowns You Might Like
                </h2>
              </div>
              <button
                onClick={onBackToHome}
                className="flex items-center gap-1.5 text-xs font-mono text-[#888] hover:text-white transition-colors cursor-pointer"
              >
                All Breakdowns <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onSelectArticle(item.id)}
                  className="group cursor-pointer rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-200"
                  style={{
                    background: '#1A1A1A',
                    border: '1px solid #242424',
                    boxShadow: '4px 4px 12px #0a0a0a, -2px -2px 6px #202020',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#333'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#242424'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#161616]">
                    <img
                      src={item.heroImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'brightness(0.8)' }}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="tag-chip text-[0.65rem] px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[item.category] || '#FF3B00'}20`,
                          color: CATEGORY_COLORS[item.category] || '#FF3B00',
                          border: `1px solid ${CATEGORY_COLORS[item.category] || '#FF3B00'}40`,
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h3 className="font-display text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#FF3B00] transition-colors mb-3">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-[#666] font-mono pt-2 border-t border-[#222]">
                      <span>{item.readTime}</span>
                      <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                        Read <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ─── Newsletter Box ────────────────────────────────────────── */}
        <section className="mt-16">
          <div
            className="rounded-xl p-8 sm:p-10 text-center"
            style={{
              background: '#181818',
              border: '1px solid #222',
              boxShadow: 'inset 3px 3px 12px #0a0a0a, inset -2px -2px 8px #222222',
            }}
          >
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#FF3B00]" />
                <span className="font-mono text-xs text-[#FF3B00] tracking-widest uppercase font-semibold">
                  THE FGA LETTER
                </span>
              </div>

              <h3
                className="font-display text-white text-xl sm:text-2xl font-bold tracking-tight mb-2.5"
                style={{ letterSpacing: '-0.02em' }}
              >
                The letter marketers actually finish reading
              </h3>

              <p className="text-xs sm:text-sm text-[#888] mb-6 leading-relaxed">
                One ad breakdown, every Thursday. No filler, no agency buzzwords. Join 14,000+ marketers.
              </p>

              {newsletterJoined ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm text-green-400 bg-green-500/10 border border-green-500/25">
                  <Check size={16} />
                  <span>You're in. Check your inbox this Thursday!</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (email.includes('@')) {
                      setNewsletterJoined(true)
                      showToast('Subscribed to The FGA Letter!')
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
                >
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded text-xs sm:text-sm text-white bg-[#121212] border border-[#282828] focus:border-[#FF3B00] outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded text-xs sm:text-sm font-semibold text-white bg-[#FF3B00] hover:bg-[#e03400] transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}

              <p className="mt-3 text-[0.7rem] text-[#555] font-mono">
                No spam. Unsubscribe in one click.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1E1E1E] bg-[#101010]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/assets/FGA%20logo%20transparent%20whiteorange.png"
                  alt="FGA Logo"
                  className="w-6 h-6 object-contain"
                />
                <span className="font-display text-white font-semibold text-base">
                  Finding Good Ads
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#777] leading-relaxed">
                Deep dives into the ads that actually worked — and why.
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-[#555] uppercase tracking-wider mb-3">
                EXPLORE
              </p>
              <div className="flex flex-col gap-2 text-xs sm:text-sm text-[#888]">
                <button
                  onClick={onBackToHome}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  Breakdowns
                </button>
                <button
                  onClick={onBackToHome}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  Carousels
                </button>
                {onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="text-left hover:text-[#FF3B00] text-[#FF3B00]/90 transition-colors cursor-pointer font-mono"
                  >
                    Admin CMS Studio
                  </button>
                )}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs text-[#555] uppercase tracking-wider mb-3">
                COMPANY
              </p>
              <div className="flex flex-col gap-2 text-xs sm:text-sm text-[#888]">
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Work with Us
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter / X
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#1C1C1C] text-xs font-mono text-[#555]">
            <span>© 2024 Finding Good Ads. All rights reserved.</span>
            <span>Made for marketers who give a damn.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
