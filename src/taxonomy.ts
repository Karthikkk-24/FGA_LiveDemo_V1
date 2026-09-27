import type { Article } from './types'

export interface Category {
  id: string
  name: string
  slug: string
  color: string
  createdAt?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt?: string
}

export interface CategoryRow {
  id: string
  name: string
  slug: string
  color: string
  created_at?: string
}

export interface TagRow {
  id: string
  name: string
  slug: string
  created_at?: string
}

export function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    color: row.color || '#FF3B00',
    createdAt: row.created_at,
  }
}

export function rowToTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
  }
}

export function slugifyLabel(value: string): string {
  return value
    .trim()
    .replace(/^#/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeTagName(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
}

/** Match article tags against a selected filter tag (case-insensitive, # optional). */
export function articleHasTag(article: Article, tagName: string): boolean {
  const needle = normalizeTagName(tagName).toLowerCase()
  return (article.tags || []).some((t) => normalizeTagName(t).toLowerCase() === needle)
}
