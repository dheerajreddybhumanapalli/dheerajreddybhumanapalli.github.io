/**
 * Client-side post catalog.
 *
 * There is no server in this React-only build, so posts are pre-rendered to
 * HTML at build time by `scripts/generate-posts.mjs` (same frontmatter rules
 * as before: filename = slug, required title/date/summary/tags) and stored in
 * `lib/posts-generated.json`. This module is a thin query layer over that
 * generated data — it performs no I/O.
 */
import generated from "./posts-generated.json";

export interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
  contentHtml: string;
  readingMinutes: number;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingMinutes: number;
}

const posts = generated as Post[];

function toMeta(post: Post): PostMeta {
  const { contentHtml: _omitted, ...meta } = post;
  return meta;
}

/** All published posts, newest first. */
export function getAllPosts(): PostMeta[] {
  return posts.map(toMeta);
}

/** Full post (including pre-rendered HTML) by slug. Returns null when not found. */
export function getPostBySlug(slug: string): Post | null {
  return posts.find((post) => post.slug === slug) ?? null;
}

/** All tags across published posts, sorted alphabetically. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort();
}

/** Up to `limit` posts sharing the most tags with the given post (excluding itself). */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];
  const tagSet = new Set(current.tags);
  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      overlap: p.tags.filter((t) => tagSet.has(t)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map(({ post }) => toMeta(post));
}
