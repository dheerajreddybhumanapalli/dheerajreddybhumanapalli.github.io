/**
 * Writes dist/sitemap.xml (and dist/robots.txt) from the generated article catalog.
 * Runs after `vite build` + prerender.
 */
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://dheerajreddybhumanapalli.github.io";
const DIST_DIR = path.join(process.cwd(), "dist");
const ARTICLES_JSON = path.join(process.cwd(), "lib", "articles-generated.json");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let articles = [];
try {
  articles = JSON.parse(fs.readFileSync(ARTICLES_JSON, "utf8"));
} catch {
  articles = [];
}

const tags = [...new Set(articles.flatMap((p) => p.tags ?? []))].sort();
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE_URL}/`, lastmod: today },
  { loc: `${SITE_URL}/articles/`, lastmod: today },
  ...articles.map((post) => ({
    loc: `${SITE_URL}/articles/${post.slug}/`,
    lastmod: post.date,
  })),
  ...tags.map((tag) => ({
    loc: `${SITE_URL}/articles/tag/${tag}/`,
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
