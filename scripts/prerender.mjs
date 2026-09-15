/**
 * Prerenders one static HTML file per route into dist/ after `vite build`.
 *
 * This React-only build is a client-side SPA (no Next.js), so without this
 * step deep links like /blog/:slug would 404 on GitHub Pages and crawlers
 * would see an empty shell. For every route this script:
 *  1. injects route-specific <title> / meta / canonical / JSON-LD head tags
 *     (mirrors what <SEO> sets at runtime), and
 *  2. renders a static content snapshot into #root so no-JS readers and
 *     crawlers see real content. The SPA replaces it on boot via createRoot.
 *
 * Also writes dist/404.html (SPA fallback for unknown paths).
 */
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://dheerajreddybhumanapalli.github.io";
const DIST_DIR = path.join(process.cwd(), "dist");
const SHELL_PATH = path.join(DIST_DIR, "index.html");
const POSTS_JSON = path.join(process.cwd(), "lib", "posts-generated.json");

// Read the Vite shell once, before any route overwrites dist/index.html.
const shell = fs.readFileSync(SHELL_PATH, "utf8");

function escapeHtml(value) {
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

const HOME = {
  title: "Dheeraj Reddy Bhumanapalli | AI Software Engineer",
  description:
    "Portfolio of Dheeraj Reddy Bhumanapalli — AI Software Engineer specializing in Generative AI, RAG, agentic workflows, LLM inference, and production backend systems.",
  canonical: `${SITE_URL}/`,
  type: "website",
};

const BLOG = {
  title: "Blog | Dheeraj Reddy Bhumanapalli",
  description:
    "AI news and technical newsletters by Dheeraj Reddy Bhumanapalli — hands-on notes on Generative AI, LLM inference, RAG, and agentic workflows.",
  canonical: `${SITE_URL}/blog/`,
  type: "website",
};

function headTags({ title, description, canonical, type, image, publishedTime, tags: postTags, jsonLd }) {
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
  for (const tag of postTags ?? []) {
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

function postCardSnapshot(post) {
  return `<article><h2><a href="/blog/${escapeHtml(post.slug)}/">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.summary)}</p><p><time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time> · ${post.readingMinutes} min read</p></article>`;
}

const homeSnapshot = `<main><h1>Dheeraj Reddy Bhumanapalli</h1><p>AI Software Engineer — Generative AI, RAG, agentic workflows, and LLM inference.</p><p><a href="/blog/">Blog</a> · <a href="/rss.xml">RSS</a> · <a href="/resume.pdf">Resume</a></p>${posts
  .slice(0, 3)
  .map(postCardSnapshot)
  .join("")}</main>`;

const blogSnapshot = `<main><h1>Blog</h1><p>AI news and technical newsletters from my explorations with new tools.</p>${posts
  .map(postCardSnapshot)
  .join("")}</main>`;

// Home + blog index
writeRoute("/", headTags(HOME), homeSnapshot);
writeRoute("/blog", headTags(BLOG), blogSnapshot);

// One page per post
for (const post of posts) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { "@type": "Person", name: "Dheeraj Reddy Bhumanapalli", url: SITE_URL },
    mainEntityOfPage: url,
    keywords: (post.tags ?? []).join(", "),
  };
  const head = headTags({
    title: `${post.title} | Dheeraj Reddy Bhumanapalli`,
    description: post.summary,
    canonical: url,
    type: "article",
    image: post.image,
    publishedTime: post.date,
    tags: post.tags,
    jsonLd,
  });
  const snapshot = `<main><p><a href="/blog/">All posts</a></p><h1>${escapeHtml(post.title)}</h1><p><time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date)}</time> · ${post.readingMinutes} min read · By Dheeraj Reddy Bhumanapalli</p><article>${post.contentHtml}</article></main>`;
  writeRoute(`/blog/${post.slug}`, head, snapshot);
}

// One page per tag
for (const tag of tags) {
  const tagged = posts.filter((p) => (p.tags ?? []).includes(tag));
  const head = headTags({
    title: `Posts tagged "${tag}" | Dheeraj Reddy Bhumanapalli`,
    description: `All blog posts tagged "${tag}" — AI news and technical newsletters by Dheeraj Reddy Bhumanapalli.`,
    canonical: `${SITE_URL}/blog/tag/${tag}/`,
    type: "website",
  });
  const snapshot = `<main><p><a href="/blog/">All posts</a></p><h1>Posts tagged ${escapeHtml(tag)}</h1><p>${tagged.length} ${tagged.length === 1 ? "post" : "posts"}</p>${tagged
    .map(postCardSnapshot)
    .join("")}</main>`;
  writeRoute(`/blog/tag/${tag}`, head, snapshot);
}

// SPA fallback for unknown paths (GitHub Pages serves this on 404s).
fs.copyFileSync(SHELL_PATH, path.join(DIST_DIR, "404.html"));
console.log("prerender: wrote dist/404.html (SPA fallback)");
