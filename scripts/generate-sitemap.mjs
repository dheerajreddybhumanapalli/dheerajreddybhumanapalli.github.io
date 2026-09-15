/**
 * Writes dist/sitemap.xml (and dist/robots.txt) from the generated post catalog.
 * Runs after `vite build` — replaces the old Next.js `app/sitemap.ts`.
 */
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://dheerajreddybhumanapalli.github.io";
const DIST_DIR = path.join(process.cwd(), "dist");
const POSTS_JSON = path.join(process.cwd(), "lib", "posts-generated.json");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let posts = [];
try {
  posts = JSON.parse(fs.readFileSync(POSTS_JSON, "utf8"));
} catch {
  posts = [];
}

const tags = [...new Set(posts.flatMap((p) => p.tags ?? []))].sort();
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE_URL}/`, lastmod: today },
  { loc: `${SITE_URL}/blog/`, lastmod: today },
  ...posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}/`,
    lastmod: post.date,
  })),
  ...tags.map((tag) => ({
    loc: `${SITE_URL}/blog/tag/${tag}/`,
    lastmod: today,
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>\n  </url>`
  )
  .join("\n")}\n</urlset>\n`;

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(DIST_DIR, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`
);
console.log(`sitemap: wrote ${urls.length} url(s) to dist/sitemap.xml`);
