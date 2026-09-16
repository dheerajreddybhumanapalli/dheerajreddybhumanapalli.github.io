/**
 * Prerenders one static HTML file per route into dist/ after `vite build`.
 *
 * This React-only build is a client-side SPA, so without this step deep
 * links like /articles/:slug would 404 on GitHub Pages and crawlers would
 * see an empty shell. For every route this script:
 *  1. injects route-specific <title> / meta / canonical / JSON-LD head tags
 *     (mirrors what <SEO> sets at runtime), and
 *  2. renders a static content snapshot into #root so no-JS readers and
 *     crawlers see real content. The SPA replaces it on boot via createRoot.
 *
 * It also emits redirect shims for the old /blog/* paths (moved to
 * /articles/*): meta-refresh + canonical + JS fallback, since static hosting
 * has no server-side redirects.
 *
 * Also writes dist/404.html (SPA fallback for unknown paths).
 */
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://dheerajreddybhumanapalli.github.io";
const DIST_DIR = path.join(process.cwd(), "dist");
const SHELL_PATH = path.join(DIST_DIR, "index.html");
const ARTICLES_JSON = path.join(process.cwd(), "lib", "articles-generated.json");
const CONTENT_DIR = path.join(process.cwd(), "public", "content", "articles");

// Read the Vite shell once, before any route overwrites dist/index.html.
const shell = fs.readFileSync(SHELL_PATH, "utf8");

function escapeHtml(value) {
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

/** Pre-rendered body HTML for an article (emitted by generate-articles.mjs). */
function articleBody(slug) {
  try {
    return fs.readFileSync(path.join(CONTENT_DIR, `${slug}.html`), "utf8");
  } catch {
    return "";
  }
}

const HOME = {
  title: "Dheeraj Reddy Bhumanapalli | AI Software Engineer",
  description:
    "Portfolio of Dheeraj Reddy Bhumanapalli — AI Software Engineer specializing in Generative AI, RAG, agentic workflows, LLM inference, and production backend systems.",
  canonical: `${SITE_URL}/`,
  type: "website",
};

const ARTICLES = {
  title: "Articles | Dheeraj Reddy Bhumanapalli",
  description:
    "Articles by Dheeraj Reddy Bhumanapalli — notes on AI, software engineering, and things worth writing down.",
  canonical: `${SITE_URL}/articles/`,
  type: "website",
};

function headTags({ title, description, canonical, type, image, publishedTime, tags: articleTags, jsonLd }) {
  const lines = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  ];
  if (image) {
    lines.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
    lines.push(`<meta name="twitter:image" content="${escapeHtml(image)}" />`);
  }
  if (publishedTime) {
    lines.push(`<meta property="article:published_time" content="${escapeHtml(publishedTime)}" />`);
  }
  for (const tag of articleTags ?? []) {
    lines.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
  }
  if (jsonLd) {
    lines.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  }
  return lines.join("\n    ");
}

function shellWith(head, snapshot) {
  // NOTE: `shell` is read once at startup. Never re-read SHELL_PATH here:
  // earlier writeRoute() calls mutate dist/index.html on disk, so re-reading
  // would leak one route's snapshot/head tags into every later route.
  let html = shell;
  // Drop the shell's default SEO tags; each route gets its own.
  html = html.replace(/<title>.*?<\/title>/s, "<!--seo-->");
  html = html.replace(/<meta\s+name="description"[^>]*>/, "<!--seo-->");
  html = html.replace("</head>", `    ${head}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${snapshot}</div>`
  );
  return html;
}

function writeRoute(routePath, head, snapshot) {
  const dir =
    routePath === "/"
      ? DIST_DIR
      : path.join(DIST_DIR, ...routePath.replace(/^\//, "").split("/"));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), shellWith(head, snapshot));
  console.log(`prerender: ${routePath || "/"} -> ${path.relative(process.cwd(), path.join(dir, "index.html"))}`);
}

/** Redirect shim for a moved path (old /blog/* → new /articles/*). */
function writeRedirect(oldPath, newUrl) {
  const dir = path.join(DIST_DIR, ...oldPath.replace(/^\//, "").split("/"));
  fs.mkdirSync(dir, { recursive: true });
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0;url=${escapeHtml(newUrl)}" />
    <link rel="canonical" href="${escapeHtml(newUrl)}" />
    <title>Redirecting…</title>
  </head>
  <body>
    <p>This page has moved to <a href="${escapeHtml(newUrl)}">${escapeHtml(newUrl)}</a>.</p>
    <script>window.location.replace(${JSON.stringify(newUrl)});</script>
  </body>
</html>
`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log(`prerender: redirect ${oldPath} -> ${newUrl}`);
}

function articleCardSnapshot(article) {
  return `<article><h2><a href="/articles/${escapeHtml(article.slug)}/">${escapeHtml(article.title)}</a></h2><p>${escapeHtml(article.summary)}</p><p><time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date)}</time> · ${article.readingMinutes} min read</p></article>`;
}

const homeSnapshot = `<main><h1>Dheeraj Reddy Bhumanapalli</h1><p>AI Software Engineer — Generative AI, RAG, agentic workflows, and LLM inference.</p><p><a href="/articles/">Articles</a> · <a href="/rss.xml">RSS</a> · <a href="/resume.pdf">Resume</a></p>${articles
  .slice(0, 3)
  .map(articleCardSnapshot)
  .join("")}</main>`;

const articlesSnapshot = `<main><h1>Articles</h1><p>Notes on AI, software engineering, and things worth writing down.</p>${articles
  .map(articleCardSnapshot)
  .join("")}</main>`;

// Home + articles index
writeRoute("/", headTags(HOME), homeSnapshot);
writeRoute("/articles", headTags(ARTICLES), articlesSnapshot);

// One page per article
for (const article of articles) {
  const url = `${SITE_URL}/articles/${article.slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    author: { "@type": "Person", name: "Dheeraj Reddy Bhumanapalli", url: SITE_URL },
    mainEntityOfPage: url,
    keywords: (article.tags ?? []).join(", "),
  };
  const head = headTags({
    title: `${article.title} | Dheeraj Reddy Bhumanapalli`,
    description: article.summary,
    canonical: url,
    type: "article",
    image: article.image,
    publishedTime: article.date,
    tags: article.tags,
    jsonLd,
  });
  const snapshot = `<main><p><a href="/articles/">All articles</a></p><h1>${escapeHtml(article.title)}</h1><p><time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date)}</time> · ${article.readingMinutes} min read · By Dheeraj Reddy Bhumanapalli</p><article>${articleBody(article.slug)}</article></main>`;
  writeRoute(`/articles/${article.slug}`, head, snapshot);
}

// One page per tag
for (const tag of tags) {
  const tagged = articles.filter((p) => (p.tags ?? []).includes(tag));
  const head = headTags({
    title: `Articles tagged "${tag}" | Dheeraj Reddy Bhumanapalli`,
    description: `All articles tagged "${tag}" by Dheeraj Reddy Bhumanapalli.`,
    canonical: `${SITE_URL}/articles/tag/${tag}/`,
    type: "website",
  });
  const snapshot = `<main><p><a href="/articles/">All articles</a></p><h1>Articles tagged ${escapeHtml(tag)}</h1><p>${tagged.length} ${tagged.length === 1 ? "article" : "articles"}</p>${tagged
    .map(articleCardSnapshot)
    .join("")}</main>`;
  writeRoute(`/articles/tag/${tag}`, head, snapshot);
}

// Redirect shims: old /blog/* paths → new /articles/* paths.
writeRedirect("/blog", `${SITE_URL}/articles/`);
for (const article of articles) {
  writeRedirect(`/blog/${article.slug}`, `${SITE_URL}/articles/${article.slug}/`);
}
for (const tag of tags) {
  writeRedirect(`/blog/tag/${tag}`, `${SITE_URL}/articles/tag/${tag}/`);
}

// SPA fallback for unknown paths (GitHub Pages serves this on 404s).
fs.copyFileSync(SHELL_PATH, path.join(DIST_DIR, "404.html"));
console.log("prerender: wrote dist/404.html (SPA fallback)");
