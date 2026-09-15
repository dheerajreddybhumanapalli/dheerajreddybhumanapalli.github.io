/**
 * Client-side article catalog.
 *
 * There is no server in this React-only build, so articles are pre-rendered
 * to HTML at build time by `scripts/generate-articles.mjs` (same frontmatter
 * rules as before: filename = slug, required title/date/summary/tags) and
 * stored in `lib/articles-generated.json`. This module is a thin query layer
 * over that generated data — it performs no I/O.
 */
import generated from "./articles-generated.json";

export interface ArticleFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  contentHtml: string;
  readingMinutes: number;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  readingMinutes: number;
}

const articles = generated as Article[];

function toMeta(article: Article): ArticleMeta {
  const { contentHtml: _omitted, ...meta } = article;
  return meta;
}

/** All published articles, newest first. */
export function getAllArticles(): ArticleMeta[] {
  return articles.map(toMeta);
}

/** Full article (including pre-rendered HTML) by slug. Returns null when not found. */
export function getArticleBySlug(slug: string): Article | null {
  return articles.find((article) => article.slug === slug) ?? null;
}

/** All tags across published articles, sorted alphabetically. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const article of articles) {
    for (const tag of article.tags) tags.add(tag);
  }
  return [...tags].sort();
}

/** Up to `limit` articles sharing the most tags with the given article (excluding itself). */
export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const current = articles.find((p) => p.slug === slug);
  if (!current) return [];
  const tagSet = new Set(current.tags);
  return articles
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      article: p,
      overlap: p.tags.filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap || (a.article.date < b.article.date ? 1 : -1))
    .slice(0, limit)
    .map(({ article }) => toMeta(article));
}
