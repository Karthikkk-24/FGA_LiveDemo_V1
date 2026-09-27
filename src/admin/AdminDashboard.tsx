import React, { useState } from 'react'
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  Filter,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'
import { Article } from '../types'

interface AdminDashboardProps {
  articles: Article[]
  onCreatePost: () => void
  onEditPost: (articleId: string) => void
  onDeletePost: (articleId: string) => void
  onViewPost: (articleId: string) => void
  onBackToSite: () => void
  onResetDefaults: () => void
}

const CATEGORY_COLORS: Record<string, string> = {
  Celebrity: '#9333EA',
  Business: '#0EA5E9',
  Sports: '#22C55E',
  'PR Stunt': '#F59E0B',
  Brands: '#FF3B00',
}

export function AdminDashboard({
  articles,
  onCreatePost,
  onEditPost,
  onDeletePost,
  onViewPost,
  onBackToSite,
  onResetDefaults,
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [deleteModalArticle, setDeleteModalArticle] = useState<Article | null>(null)
  const [confirmResetModal, setConfirmResetModal] = useState(false)

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))]

  // Filter articles
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Summary counts
  const totalPosts = articles.length
  const publishedCount = articles.filter((a) => (a.status || 'published') === 'published').length
  const draftCount = articles.filter((a) => a.status === 'draft').length

  const handleDeleteConfirm = () => {
    if (deleteModalArticle) {
      onDeletePost(deleteModalArticle.id)
      setDeleteModalArticle(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* ─── Top Admin Bar ────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: 'rgba(18,18,18,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #222',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#A0A0A0] hover:text-[#FF3B00] px-3 py-1.5 rounded transition-all hover:bg-[#1A1A1A] border border-transparent hover:border-[#282828] cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Live Website</span>
            </button>

            <div className="h-4 w-[1px] bg-[#2A2A2A]" />

            <div className="flex items-center gap-2.5">
              <img
                src="/assets/FGA%20logo%20transparent%20whiteorange.png"
                alt="FGA Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="font-display font-semibold text-white tracking-tight text-base sm:text-lg">
                CMS Studio <span className="text-[#FF3B00] font-mono text-xs font-normal">v2.0</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setConfirmResetModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-[#888] hover:text-white bg-[#1A1A1A] hover:bg-[#222] border border-[#262626] transition-all cursor-pointer"
              title="Reset sample articles to default"
            >
              <RotateCcw size={12} />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={onCreatePost}
              className="flex items-center gap-2 px-4 py-2 rounded font-semibold text-xs sm:text-sm text-white bg-[#FF3B00] hover:bg-[#e03400] transition-all shadow-[0_0_15px_rgba(255,59,0,0.35)] cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Create New Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FF3B00]/10 border border-[#FF3B00]/25 text-[#FF3B00] font-mono text-xs font-medium mb-3">
              <Sparkles size={12} />
              <span>CONTENT MANAGEMENT SYSTEM</span>
            </div>
            <h1
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              Article Management Portal
            </h1>
            <p className="text-sm text-[#A0A0A0] mt-1.5 max-w-xl">
              Create, edit, preview, and publish campaign breakdowns and slide decks dynamically for Finding Good Ads.
            </p>
          </div>

          {/* Stat Badges */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div
              className="px-4 py-2.5 rounded-lg text-center min-w-[90px]"
              style={{
                background: '#1A1A1A',
                border: '1px solid #242424',
                boxShadow: '3px 3px 8px #090909, -2px -2px 6px #202020',
              }}
            >
              <div className="font-mono text-[0.68rem] text-[#777] uppercase">Total</div>
              <div className="font-display text-xl font-bold text-white">{totalPosts}</div>
            </div>

            <div
              className="px-4 py-2.5 rounded-lg text-center min-w-[90px]"
              style={{
                background: '#1A1A1A',
                border: '1px solid #242424',
                boxShadow: '3px 3px 8px #090909, -2px -2px 6px #202020',
              }}
            >
              <div className="font-mono text-[0.68rem] text-green-400 uppercase">Live</div>
              <div className="font-display text-xl font-bold text-green-400">{publishedCount}</div>
            </div>

            <div
              className="px-4 py-2.5 rounded-lg text-center min-w-[90px]"
              style={{
                background: '#1A1A1A',
                border: '1px solid #242424',
                boxShadow: '3px 3px 8px #090909, -2px -2px 6px #202020',
              }}
            >
              <div className="font-mono text-[0.68rem] text-[#FF3B00] uppercase">Drafts</div>
              <div className="font-display text-xl font-bold text-[#FF3B00]">{draftCount}</div>
            </div>
          </div>
        </div>

        {/* ─── Search & Category Filter Bar ─────────────────────────── */}
        <div
          className="p-4 sm:p-5 rounded-xl mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
          style={{
            background: '#1E1E1E',
            border: '1px solid #2A2A2A',
            boxShadow: '4px 4px 12px #0a0a0a, -2px -2px 8px #222222',
          }}
        >
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777]"
            />
            <input
              type="text"
              placeholder="Search by title, summary, or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded bg-[#141414] text-sm text-white placeholder-neutral-500 border border-[#282828] focus:border-[#FF3B00] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#777] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scroll-hide">
            <Filter size={14} className="text-[#666] mr-1 hidden sm:inline flex-shrink-0" />
            {categories.map((cat) => {
              const active = selectedCategory === cat
              const color = CATEGORY_COLORS[cat] || '#FF3B00'
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded text-xs font-mono transition-all flex-shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: active ? (cat === 'All' ? '#FF3B00' : color) : '#141414',
                    color: active ? '#ffffff' : '#A0A0A0',
                    border: `1px solid ${active ? 'transparent' : '#282828'}`,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── Articles Table / Card List ────────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: '#1A1A1A',
            border: '1px solid #262626',
            boxShadow: '6px 6px 18px #080808, -3px -3px 10px #222222',
          }}
        >
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={40} className="mx-auto text-[#444] mb-3" />
              <h3 className="font-display text-lg text-white font-semibold mb-1">
                No articles found
              </h3>
              <p className="text-sm text-[#888] max-w-sm mx-auto mb-6">
                Try adjusting your search query or category filter, or click below to create a brand new breakdown.
              </p>
              <button
                onClick={onCreatePost}
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold text-white bg-[#FF3B00] hover:bg-[#e03400] transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Create Your First Post</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#242424] text-[0.72rem] font-mono text-[#777] uppercase tracking-wider bg-[#161616]">
                    <th className="py-3.5 px-4 sm:px-6">Article</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Date</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222] text-sm">
                  {filteredArticles.map((article) => {
                    const isDraft = article.status === 'draft'
                    const catColor = CATEGORY_COLORS[article.category] || '#FF3B00'

                    return (
                      <tr
                        key={article.id}
                        className="hover:bg-[#1E1E1E]/80 transition-colors group"
                      >
                        {/* Thumbnail & Title */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-16 h-12 rounded overflow-hidden bg-[#141414] border border-[#282828] flex-shrink-0">
                              <img
                                src={article.heroImage}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="min-w-0 max-w-lg">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span
                                  className="tag-chip text-[0.62rem] px-2 py-0.5 rounded md:hidden"
                                  style={{
                                    backgroundColor: `${catColor}15`,
                                    color: catColor,
                                    border: `1px solid ${catColor}30`,
                                  }}
                                >
                                  {article.category}
                                </span>
                                {article.slides && article.slides.length > 0 && (
                                  <span className="font-mono text-[0.65rem] text-[#FF3B00] bg-[#FF3B00]/10 px-1.5 py-0.5 rounded border border-[#FF3B00]/20">
                                    {article.slides.length} slides
                                  </span>
                                )}
                              </div>
                              <h4
                                onClick={() => onViewPost(article.id)}
                                className="font-display font-medium text-white group-hover:text-[#FF3B00] transition-colors truncate cursor-pointer text-sm sm:text-base leading-snug"
                                title={article.title}
                              >
                                {article.title}
                              </h4>
                              <p className="text-xs text-[#888] truncate mt-0.5 hidden sm:block">
                                {article.summary}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span
                            className="tag-chip text-xs px-2.5 py-1 rounded inline-block"
                            style={{
                              backgroundColor: `${catColor}15`,
                              color: catColor,
                              border: `1px solid ${catColor}30`,
                            }}
                          >
                            {article.category}
                          </span>
                        </td>

                        {/* Date & Read time */}
                        <td className="py-4 px-4 hidden sm:table-cell font-mono text-xs text-[#A0A0A0]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#666]" />
                            <span>{article.publishedDate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[0.7rem] text-[#666] mt-1">
                            <Clock size={10} />
                            <span>{article.readTime}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 hidden lg:table-cell">
                          {isDraft ? (
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/25">
                              Draft
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/25">
                              <CheckCircle2 size={11} />
                              Published
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Live */}
                            <button
                              onClick={() => onViewPost(article.id)}
                              className="p-2 rounded bg-[#181818] hover:bg-[#222] text-[#A0A0A0] hover:text-white border border-[#252525] transition-all cursor-pointer"
                              title="View Article"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => onEditPost(article.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#181818] hover:bg-[#FF3B00]/15 text-[#A0A0A0] hover:text-[#FF3B00] border border-[#252525] hover:border-[#FF3B00]/30 text-xs font-medium transition-all cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit3 size={13} />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteModalArticle(article)}
                              className="p-2 rounded bg-[#181818] hover:bg-red-500/15 text-[#A0A0A0] hover:text-red-400 border border-[#252525] hover:border-red-500/30 transition-all cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ─── Delete Confirmation Modal ───────────────────────────────── */}
      {deleteModalArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md rounded-xl p-6 relative"
            style={{
              background: '#1A1A1A',
              border: '1px solid #333',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(255,59,0,0.1)',
            }}
          >
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/15 border border-red-500/30">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-base">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-[#888]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              Are you sure you want to permanently remove{' '}
              <span className="font-semibold text-white">"{deleteModalArticle.title}"</span>? It will no longer appear on the live site or breakdown feeds.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalArticle(null)}
                className="px-4 py-2 rounded text-xs font-mono text-[#A0A0A0] hover:text-white bg-[#141414] border border-[#282828] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg cursor-pointer"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reset Confirmation Modal ────────────────────────────────── */}
      {confirmResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl p-6"
            style={{
              background: '#1A1A1A',
              border: '1px solid #333',
            }}
          >
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <RotateCcw size={20} />
              <h3 className="font-display font-semibold text-white text-base">
                Reset to Default Articles?
              </h3>
            </div>
            <p className="text-sm text-neutral-300 mb-6">
              This will re-populate all default campaigns (Nike AF1, 818 Tequila, Burger King, Ryan Reynolds, etc.) and reset any custom edits.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmResetModal(false)}
                className="px-4 py-2 rounded text-xs font-mono text-[#888] hover:text-white bg-[#141414] border border-[#282828] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDefaults()
                  setConfirmResetModal(false)
                }}
                className="px-4 py-2 rounded text-xs font-semibold text-white bg-[#FF3B00] hover:bg-[#e03400] cursor-pointer"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
