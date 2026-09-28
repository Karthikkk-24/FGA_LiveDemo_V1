import { useState } from 'react'
import { ArrowLeft, Plus, Pencil, Trash2, Tags, FolderOpen, Check, X } from 'lucide-react'
import { useTaxonomy } from '../taxonomyStorage'
import { normalizeTagName } from '../taxonomy'

interface AdminTaxonomyProps {
  onBack: () => void
}

const COLOR_PRESETS = ['#FF3B00', '#9333EA', '#0EA5E9', '#22C55E', '#F59E0B', '#EC4899', '#14B8A6', '#6366F1']

export function AdminTaxonomy({ onBack }: AdminTaxonomyProps) {
  const {
    categories,
    tags,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createTag,
    updateTag,
    deleteTag,
  } = useTaxonomy()

  const [newCategory, setNewCategory] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#FF3B00')
  const [newTag, setNewTag] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editingTagName, setEditingTagName] = useState('')
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    setLocalError(null)
    try {
      await fn()
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: 'rgba(18,18,18,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #222',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-[#888] hover:text-white cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to CMS
            </button>
            <span className="text-[#333]">|</span>
            <h1 className="font-display text-lg font-semibold">Categories & Tags</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <p className="text-sm text-[#888] max-w-2xl">
          Create reusable categories and tags here. They appear in the post editor and power filters
          on the public site and CMS dashboard.
        </p>

        {(error || localError) && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {localError || error}
          </div>
        )}

        {loading ? (
          <div className="text-[#666] font-mono text-sm">Loading taxonomy…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories */}
            <section
              className="rounded-xl p-5 space-y-4"
              style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}
            >
              <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
                <FolderOpen size={16} className="text-[#FF3B00]" />
                <h2 className="font-display font-semibold">Categories</h2>
                <span className="ml-auto font-mono text-xs text-[#666]">{categories.length}</span>
              </div>

              <form
                className="flex flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  const name = newCategory.trim()
                  if (!name) return
                  void run(async () => {
                    await createCategory(name, newCategoryColor)
                    setNewCategory('')
                  })
                }}
              >
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#141414] text-sm border border-[#282828] outline-none focus:border-[#FF3B00]"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewCategoryColor(c)}
                      className="w-6 h-6 rounded-full cursor-pointer"
                      style={{
                        background: c,
                        outline: newCategoryColor === c ? '2px solid white' : 'none',
                        outlineOffset: 2,
                      }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                  <button
                    type="submit"
                    disabled={busy || !newCategory.trim()}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#FF3B00] hover:bg-[#e03400] disabled:opacity-40 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>
              </form>

              <ul className="space-y-2 max-h-[420px] overflow-y-auto">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center gap-2 px-3 py-2 rounded bg-[#141414] border border-[#262626]"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: cat.color }}
                    />
                    {editingCategoryId === cat.id ? (
                      <>
                        <input
                          value={editingCategoryName}
                          onChange={(e) => setEditingCategoryName(e.target.value)}
                          className="flex-1 px-2 py-1 rounded bg-[#1C1C1C] text-sm border border-[#333] outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await updateCategory(cat.id, { name: editingCategoryName })
                              setEditingCategoryId(null)
                            })
                          }
                          className="text-green-400 cursor-pointer"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategoryId(null)}
                          className="text-[#888] cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm">{cat.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(cat.id)
                            setEditingCategoryName(cat.name)
                          }}
                          className="text-[#777] hover:text-white cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            if (!confirm(`Delete category "${cat.name}"? Posts keep their category text.`))
                              return
                            void run(async () => {
                              await deleteCategory(cat.id)
                            })
                          }}
                          className="text-[#777] hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {/* Tags */}
            <section
              className="rounded-xl p-5 space-y-4"
              style={{ background: '#1E1E1E', border: '1px solid #2A2A2A' }}
            >
              <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
                <Tags size={16} className="text-[#FF3B00]" />
                <h2 className="font-display font-semibold">Tags</h2>
                <span className="ml-auto font-mono text-xs text-[#666]">{tags.length}</span>
              </div>

              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  const name = normalizeTagName(newTag)
                  if (!name) return
                  void run(async () => {
                    await createTag(name)
                    setNewTag('')
                  })
                }}
              >
                <input
                  type="text"
                  placeholder="#NewTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-[#141414] text-sm border border-[#282828] outline-none focus:border-[#FF3B00] font-mono"
                />
                <button
                  type="submit"
                  disabled={busy || !newTag.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#FF3B00] hover:bg-[#e03400] disabled:opacity-40 cursor-pointer"
                >
                  <Plus size={14} />
                  Add
                </button>
              </form>

              <ul className="space-y-2 max-h-[420px] overflow-y-auto">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="flex items-center gap-2 px-3 py-2 rounded bg-[#141414] border border-[#262626]"
                  >
                    {editingTagId === tag.id ? (
                      <>
                        <input
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="flex-1 px-2 py-1 rounded bg-[#1C1C1C] text-sm border border-[#333] outline-none font-mono"
                          autoFocus
                        />
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await updateTag(tag.id, editingTagName)
                              setEditingTagId(null)
                            })
                          }
                          className="text-green-400 cursor-pointer"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTagId(null)}
                          className="text-[#888] cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-mono text-[#ccc]">{tag.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTagId(tag.id)
                            setEditingTagName(tag.name)
                          }}
                          className="text-[#777] hover:text-white cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            if (!confirm(`Delete tag "${tag.name}"? Posts keep their tag text.`)) return
                            void run(async () => {
                              await deleteTag(tag.id)
                            })
                          }}
                          className="text-[#777] hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
