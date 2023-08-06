import { filterXSS } from 'xss'

export class Course {
  id: string
  slug: string
  title: string
  description: string
  author_id?: string
  contents: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date

  validate(): boolean {
    // validate slug
    const reValidSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/g
    if (!reValidSlug.test(this.slug)) {
      return false
    }
    return true
  }

  sanityXss(): void {
    this.title = filterXSS(this.title)
    this.description = filterXSS(this.description)
    this.contents = filterXSS(this.contents)
  }
}
