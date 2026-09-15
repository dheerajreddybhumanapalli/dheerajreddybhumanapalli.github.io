# Article authoring

Articles are Markdown files in `content/articles/` — on any topic you choose.
The build turns them into listing cards, per-article pages, tag pages, RSS
items, and sitemap entries — no manual wiring needed.

## Creating an article

1. Copy `content/articles/_template.md` to a new file, e.g.
   `content/articles/vllm-vs-sglang-first-look.md`.
2. Fill in frontmatter (see rules below) and write the body in Markdown
   (headings, code blocks, tables, quotes supported).
3. Preview: `npm run dev` → `http://localhost:5173/articles/your-slug/`.
4. Publish: remove `draft: true`, then `npm run deploy`.

## Frontmatter rules

Enforced by `scripts/generate-articles.mjs` — the build **throws** on violations.

- **Filename = slug**: lowercase letters, numbers, hyphens only
  (`^[a-z0-9]+(-[a-z0-9]+)*\.md`). The filename becomes the URL
  (`/articles/<slug>/`).
- Files starting with `_` (e.g. `_template.md`) are ignored.
- Required: `title`, `date` (`YYYY-MM-DD`), `summary` (1–2 sentences, used for
  SEO + RSS), `tags` (free-topic list, lowercased and deduped by the generator).
- Optional: `image` (path to a custom OG image in `public/`), `draft: true`.

## Drafts

`draft: true` hides the article from the listing, article pages (renders
`NotFound`), related articles, tag pages, RSS, sitemap, and prerender output.
Use it to stage an article: preview it locally, then publish by removing the
flag.

## Images in articles

- Put images in `public/` and reference them with root-relative paths
  (`/my-image.png`); the RSS generator absolutizes them to the production URL.
- An article's `image` frontmatter becomes the OG/Twitter image for that page.

## What regenerates on build

| Artifact | Generator | Trigger |
|----------|-----------|---------|
| `lib/articles-generated.json` | `generate-articles.mjs` | `predev`, `prebuild` |
| `public/rss.xml` | `generate-rss.mjs` | `prebuild` |
| `dist/**/index.html`, `dist/404.html` | `prerender.mjs` | after `vite build` |
| `dist/sitemap.xml`, `dist/robots.txt` | `generate-sitemap.mjs` | after prerender |

RSS is the subscription channel — there is no email signup on the static site.
After deploying a new article, submit
`https://dheerajreddybhumanapalli.github.io/sitemap.xml` in Google Search
Console and Bing Webmaster Tools so it gets indexed.

## Old `/blog/*` URLs

Canonical paths moved from `/blog/*` to `/articles/*`. The prerender step
emits meta-refresh redirect shims at the old paths — never link to `/blog/*`
in new content.
