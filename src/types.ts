export interface Author {
  name: string
  role: string
  avatar: string
  handle?: string
}

export interface SlideItem {
  id: number
  title: string
  subtitle?: string
  caption: string
  imageUrl: string
}

export interface ArticleSection {
  heading: string
  subheading?: string
  body: string[]
  quote?: {
    text: string
    author: string
  }
  image?: {
    url: string
    caption: string
  }
  callout?: string
}

export interface Article {
  id: string
  numericId: number
  title: string
  summary: string
  category: string
  readTime: string
  publishedDate: string
  heroImage: string
  author: Author
  keyTakeaways: string[]
  tags: string[]
  status?: 'published' | 'draft'
  stats?: { label: string; value: string }[]
  slides?: SlideItem[]
  content: {
    intro: string[]
    sections: ArticleSection[]
    conclusion: string
  }
}
