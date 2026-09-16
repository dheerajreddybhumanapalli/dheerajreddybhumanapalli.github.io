/**
 * Client-side article catalog (metadata only).
 *
 * There is no server in this React-only build. At build time
 * `scripts/generate-articles.mjs` writes:
 * - `lib/articles-generated.json` — metadata only (slug, title, date,
 *   summary, tags, image, readingMinutes). Imported here so list pages
 *   stay small no matter how many articles exist.
 * - `public/content/articles/<slug>.html` — full pre-rendered body,
 *   fetched lazily via `loadArticleContent()` (gitignored, copied to
 *   dist/ by Vite).
 *
 * This module performs no I/O at import time; only `loadArticleContent()`
 * fetches, and only for the article being viewed.
 */
import generated from "./articles-generated.json";
import { assetPath } from "./utils";

export interface ArticleFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  readingMinutes: number;
}

/** Backwards-compatible alias: an Article is now just its metadata. */
export type Article = ArticleMeta;

const articles = generated as ArticleMeta[];

/** All published articles, newest first. */
export function getAllArticles(): ArticleMeta[] {
  return [...articles];
}

/** Article metadata by slug. Returns null when not found. */
export function getArticleBySlug(slug: string): ArticleMeta | null {
  return articles.find((article) => article.slug === slug) ?? null;
}

/** URL of the pre-rendered body file for an article. */
export function articleContentPath(slug: string): string {
  return assetPath(`/content/articles/${slug}.html`);
}

/** Fetch the pre-rendered body HTML for an article. */
export async function loadArticleContent(slug: string): Promise<string> {
  const res = await fetch(articleContentPath(slug));
  if (!res.ok) {
    throw new Error(`Failed to load article "${slug}" (${res.status})`);
  }
  return res.text();
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
    .map(({ article }) => article);
}
