/**
 * Pre-renders content/articles/*.md to a metadata-only catalog plus one
 * HTML body file per article.
 *
 * Outputs:
 * - lib/articles-generated.json — metadata only (slug, title, date,
 *   summary, tags, image, draft, readingMinutes). Imported by the client
 *   bundle, so it must stay small no matter how many articles exist.
 * - public/content/articles/<slug>.html — full pre-rendered body, fetched
 *   lazily by ArticlePage. Served by Vite in dev and copied to dist/ on
 *   build (gitignored: derivable from content/*.md).
 *
 * Runs before `vite dev` (predev) and `vite build` (prebuild) so the
 * client-side catalog in lib/articles.ts never performs I/O.
 *
 * Rules:
 * - Filename = slug: lowercase letters, numbers, hyphens only.
 * - `_`-prefixed files are skipped; `draft: true` hides the article.
 * - Required frontmatter: title, date (YYYY-MM-DD), summary, tags (list).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const POSTS_DIR = path.join(process.cwd(), "content", "articles");
const OUT_PATH = path.join(process.cwd(), "lib", "articles-generated.json");
const CONTENT_DIR = path.join(process.cwd(), "public", "content", "articles");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readingMinutesFor(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseTags(value, slug) {
  if (!Array.isArray(value)) {
    throw new Error(
      `Article "${slug}" has invalid frontmatter: "tags" must be a list, e.g. tags: [ai, tutorial]`
    );
  }
  const tags = value.map((t) => String(t).trim().toLowerCase());
  if (tags.some((t) => t.length === 0)) {
    throw new Error(`Article "${slug}" has an empty tag in frontmatter "tags"`);
  }
  return [...new Set(tags)];
}

function validateFrontmatter(slug, data) {
  const { title, date, summary, tags, image, draft } = data;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(`Article "${slug}" has invalid frontmatter: "title" is required`);
  }
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(date))
  ) {
    throw new Error(
      `Article "${slug}" has invalid frontmatter: "date" must be YYYY-MM-DD`
    );
  }
  if (typeof summary !== "string" || summary.trim().length === 0) {
    throw new Error(`Article "${slug}" has invalid frontmatter: "summary" is required`);
  }
  if (image !== undefined && (typeof image !== "string" || image.trim().length === 0)) {
    throw new Error(`Article "${slug}" has invalid frontmatter: "image" must be a non-empty path`);
  }
  if (draft !== undefined && typeof draft !== "boolean") {
    throw new Error(`Article "${slug}" has invalid frontmatter: "draft" must be true or false`);
  }

  return {
    title: title.trim(),
    date,
    summary: summary.trim(),
    tags: parseTags(tags, slug),
    ...(image ? { image: image.trim() } : {}),
    ...(draft !== undefined ? { draft } : {}),
  };
}

const articles = [];
const bodies = new Map();
if (fs.existsSync(POSTS_DIR)) {
  for (const fileName of fs.readdirSync(POSTS_DIR)) {
    if (!fileName.endsWith(".md") || fileName.startsWith("_")) continue;
    const slug = fileName.replace(/\.md$/, "");
    if (!SLUG_PATTERN.test(slug)) {
      throw new Error(
        `Invalid article filename "${fileName}": use lowercase letters, numbers, and hyphens only (e.g. my-first-post.md)`
      );
    }
    const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
    const { data, content } = matter(raw);
    const frontmatter = validateFrontmatter(slug, data);
    if (frontmatter.draft === true) continue;
    const rendered = await remark().use(remarkGfm).use(remarkHtml).process(content);
    bodies.set(slug, String(rendered));
    articles.push({
      ...frontmatter,
      slug,
      readingMinutes: readingMinutesFor(content),
    });
  }
}
articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

fs.writeFileSync(OUT_PATH, `${JSON.stringify(articles, null, 2)}\n`);
console.log(`articles: wrote ${articles.length} article(s) to lib/articles-generated.json`);

// One body file per article; drop stale files from deleted/renamed slugs.
fs.mkdirSync(CONTENT_DIR, { recursive: true });
for (const [slug, html] of bodies) {
  fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.html`), `${html}\n`);
}
if (fs.existsSync(CONTENT_DIR)) {
  const live = new Set(bodies.keys());
  for (const fileName of fs.readdirSync(CONTENT_DIR)) {
    if (!fileName.endsWith(".html")) continue;
    if (!live.has(fileName.replace(/\.html$/, ""))) {
      fs.rmSync(path.join(CONTENT_DIR, fileName));
    }
  }
}
console.log(`articles: wrote ${bodies.size} body file(s) to public/content/articles/`);
