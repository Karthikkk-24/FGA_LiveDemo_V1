import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from './lib/supabase'
import {
  normalizeTagName,
  rowToCategory,
  rowToTag,
  slugifyLabel,
  type Category,
  type CategoryRow,
  type Tag,
  type TagRow,
} from './taxonomy'

type TaxonomyContextValue = {
  categories: Category[]
  tags: Tag[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createCategory: (name: string, color?: string) => Promise<Category>
  updateCategory: (id: string, patch: { name?: string; color?: string }) => Promise<Category>
  deleteCategory: (id: string) => Promise<void>
  createTag: (name: string) => Promise<Tag>
  updateTag: (id: string, name: string) => Promise<Tag>
  deleteTag: (id: string) => Promise<void>
  ensureCategory: (name: string) => Promise<Category>
  ensureTag: (name: string) => Promise<Tag>
}

const TaxonomyContext = createContext<TaxonomyContextValue | null>(null)

export function TaxonomyProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setError(null)
    const [catRes, tagRes] = await Promise.all([
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase.from('tags').select('*').order('name', { ascending: true }),
    ])

    if (catRes.error || tagRes.error) {
      const message = catRes.error?.message || tagRes.error?.message || 'Failed to load taxonomy'
      console.error('Failed to load taxonomy:', catRes.error || tagRes.error)
      setError(message)
      setLoading(false)
      return
    }

    setCategories(((catRes.data || []) as CategoryRow[]).map(rowToCategory))
    setTags(((tagRes.data || []) as TagRow[]).map(rowToTag))
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()

    const channel = supabase
      .channel('taxonomy-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        void refresh()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, () => {
        void refresh()
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [refresh])

  const createCategory = useCallback(
    async (name: string, color = '#FF3B00'): Promise<Category> => {
      const trimmed = name.trim()
      if (!trimmed) throw new Error('Category name is required.')
      const slug = slugifyLabel(trimmed)
      if (!slug) throw new Error('Category name is invalid.')

      const { data, error: insertError } = await supabase
        .from('categories')
        .insert({ name: trimmed, slug, color })
        .select('*')
        .single()

      if (insertError) throw new Error(insertError.message)
      const created = rowToCategory(data as CategoryRow)
      setCategories((prev) =>
        [...prev.filter((c) => c.id !== created.id), created].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      )
      return created
    },
    []
  )

  const updateCategory = useCallback(
    async (id: string, patch: { name?: string; color?: string }): Promise<Category> => {
      const payload: Partial<CategoryRow> = {}
      if (patch.name !== undefined) {
        const trimmed = patch.name.trim()
        if (!trimmed) throw new Error('Category name is required.')
        payload.name = trimmed
        payload.slug = slugifyLabel(trimmed)
      }
      if (patch.color !== undefined) payload.color = patch.color

      const { data, error: updateError } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()

      if (updateError) throw new Error(updateError.message)
      const updated = rowToCategory(data as CategoryRow)
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? updated : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      return updated
    },
    []
  )

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', id)
    if (deleteError) throw new Error(deleteError.message)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const createTag = useCallback(async (name: string): Promise<Tag> => {
    const normalized = normalizeTagName(name)
    if (!normalized) throw new Error('Tag name is required.')
    const slug = slugifyLabel(normalized)
    if (!slug) throw new Error('Tag name is invalid.')

    const { data, error: insertError } = await supabase
      .from('tags')
      .insert({ name: normalized, slug })
      .select('*')
      .single()

    if (insertError) throw new Error(insertError.message)
    const created = rowToTag(data as TagRow)
    setTags((prev) =>
      [...prev.filter((t) => t.id !== created.id), created].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    )
    return created
  }, [])

  const updateTag = useCallback(async (id: string, name: string): Promise<Tag> => {
    const normalized = normalizeTagName(name)
    if (!normalized) throw new Error('Tag name is required.')
    const slug = slugifyLabel(normalized)

    const { data, error: updateError } = await supabase
      .from('tags')
      .update({ name: normalized, slug })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) throw new Error(updateError.message)
    const updated = rowToTag(data as TagRow)
    setTags((prev) =>
      prev.map((t) => (t.id === id ? updated : t)).sort((a, b) => a.name.localeCompare(b.name))
    )
    return updated
  }, [])

  const deleteTag = useCallback(async (id: string): Promise<void> => {
    const { error: deleteError } = await supabase.from('tags').delete().eq('id', id)
    if (deleteError) throw new Error(deleteError.message)
    setTags((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const ensureCategory = useCallback(
    async (name: string): Promise<Category> => {
      const trimmed = name.trim()
      const existing = categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase())
      if (existing) return existing
      try {
        return await createCategory(trimmed)
      } catch (e) {
        await refresh()
        const after = categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase())
        if (after) return after
        // Re-fetch once more from DB
        const { data } = await supabase
          .from('categories')
          .select('*')
          .ilike('name', trimmed)
          .maybeSingle()
        if (data) return rowToCategory(data as CategoryRow)
        throw e
      }
    },
    [categories, createCategory, refresh]
  )

  const ensureTag = useCallback(
    async (name: string): Promise<Tag> => {
      const normalized = normalizeTagName(name)
      const existing = tags.find(
        (t) => normalizeTagName(t.name).toLowerCase() === normalized.toLowerCase()
      )
      if (existing) return existing
      try {
        return await createTag(normalized)
      } catch (e) {
        const { data } = await supabase
          .from('tags')
          .select('*')
          .ilike('name', normalized)
          .maybeSingle()
        if (data) {
          const found = rowToTag(data as TagRow)
          setTags((prev) =>
            [...prev.filter((t) => t.id !== found.id), found].sort((a, b) =>
              a.name.localeCompare(b.name)
            )
          )
          return found
        }
        throw e
      }
    },
    [tags, createTag]
  )

  const value = useMemo(
    () => ({
      categories,
      tags,
      loading,
      error,
      refresh,
      createCategory,
      updateCategory,
      deleteCategory,
      createTag,
      updateTag,
      deleteTag,
      ensureCategory,
      ensureTag,
    }),
    [
      categories,
      tags,
      loading,
      error,
      refresh,
      createCategory,
      updateCategory,
      deleteCategory,
      createTag,
      updateTag,
      deleteTag,
      ensureCategory,
      ensureTag,
    ]
  )

  return <TaxonomyContext.Provider value={value}>{children}</TaxonomyContext.Provider>
}

export function useTaxonomy(): TaxonomyContextValue {
  const ctx = useContext(TaxonomyContext)
  if (!ctx) throw new Error('useTaxonomy must be used within TaxonomyProvider')
  return ctx
}
