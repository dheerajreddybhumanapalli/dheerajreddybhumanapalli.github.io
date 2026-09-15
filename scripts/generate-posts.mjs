/**
 * Pre-renders content/blog/*.md to lib/posts-generated.json.
 *
 * Runs before `vite dev` (predev) and `vite build` (prebuild) so the
 * client-side catalog in lib/posts.ts never performs I/O.
 *
 * Rules (same as the old Next.js version):
 * - Filename = slug: lowercase letters, numbers, hyphens only.
 * - `_`-prefixed files are skipped; `draft: true` hides the post.
 * - Required frontmatter: title, date (YYYY-MM-DD), summary, tags (list).
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const OUT_PATH = path.join(process.cwd(), "lib", "posts-generated.json");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readingMinutesFor(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseTags(value, slug) {
  if (!Array.isArray(value)) {
    throw new Error(
      `Post "${slug}" has invalid frontmatter: "tags" must be a list, e.g. tags: [ai-news, newsletter]`
    );
  }
  const tags = value.map((t) => String(t).trim().toLowerCase());
  if (tags.some((t) => t.length === 0)) {
    throw new Error(`Post "${slug}" has an empty tag in frontmatter "tags"`);
  }
  return [...new Set(tags)];
}

function validateFrontmatter(slug, data) {
  const { title, date, summary, tags, image, draft } = data;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(`Post "${slug}" has invalid frontmatter: "title" is required`);
  }
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(date))
  ) {
    throw new Error(
      `Post "${slug}" has invalid frontmatter: "date" must be YYYY-MM-DD`
    );
  }
  if (typeof summary !== "string" || summary.trim().length === 0) {
    throw new Error(`Post "${slug}" has invalid frontmatter: "summary" is required`);
  }
  if (image !== undefined && (typeof image !== "string" || image.trim().length === 0)) {
    throw new Error(`Post "${slug}" has invalid frontmatter: "image" must be a non-empty path`);
  }
  if (draft !== undefined && typeof draft !== "boolean") {
    throw new Error(`Post "${slug}" has invalid frontmatter: "draft" must be true or false`);
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

const posts = [];
if (fs.existsSync(POSTS_DIR)) {
  for (const fileName of fs.readdirSync(POSTS_DIR)) {
    if (!fileName.endsWith(".md") || fileName.startsWith("_")) continue;
    const slug = fileName.replace(/\.md$/, "");
    if (!SLUG_PATTERN.test(slug)) {
      throw new Error(
        `Invalid post filename "${fileName}": use lowercase letters, numbers, and hyphens only (e.g. my-first-post.md)`
      );
    }
    const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
    const { data, content } = matter(raw);
    const frontmatter = validateFrontmatter(slug, data);
    if (frontmatter.draft === true) continue;
    const rendered = await remark().use(remarkHtml).process(content);
    posts.push({
      ...frontmatter,
      slug,
      contentHtml: String(rendered),
      readingMinutes: readingMinutesFor(content),
    });
  }
}
posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

fs.writeFileSync(OUT_PATH, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`posts: wrote ${posts.length} post(s) to lib/posts-generated.json`);
