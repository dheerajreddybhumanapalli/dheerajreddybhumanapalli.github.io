# Blog authoring

Posts are Markdown files in `content/blog/`. The build turns them into listing
cards, per-post pages, tag pages, RSS items, and sitemap entries — no manual
wiring needed.

## Creating a post

1. Copy `content/blog/_template.md` to a new file, e.g.
   `content/blog/vllm-vs-sglang-first-look.md`.
2. Fill in frontmatter (see rules below) and write the body in Markdown
   (headings, code blocks, tables, quotes supported).
3. Preview: `npm run dev` → `http://localhost:5173/blog/your-slug/`.
4. Publish: remove `draft: true`, then `npm run deploy`.

## Frontmatter rules

Enforced by `scripts/generate-posts.mjs` — the build **throws** on violations.

- **Filename = slug**: lowercase letters, numbers, hyphens only
  (`^[a-z0-9]+(-[a-z0-9]+)*\.md`). The filename becomes the URL
  (`/blog/<slug>/`).
- Files starting with `_` (e.g. `_template.md`) are ignored.
- Required: `title`, `date` (`YYYY-MM-DD`), `summary` (1–2 sentences, used for
  SEO + RSS), `tags` (list, lowercased and deduped by the generator).
- Optional: `image` (path to a custom OG image in `public/`), `draft: true`.
- Tag vocabulary: `ai-news` for news roundups, `newsletter` for hands-on
  technical notes (convention, not enforced).

## Drafts

`draft: true` hides the post from the listing, post pages (renders `NotFound`),
related-posts, tag pages, RSS, sitemap, and prerender output. Use it to stage
a post: preview it locally, then publish by removing the flag.

## Images in posts

- Put images in `public/` and reference them with root-relative paths
  (`/my-image.png`); the RSS generator absolutizes them to the production URL.
- A post's `image` frontmatter becomes the OG/Twitter image for that post.

## What regenerates on build

| Artifact | Generator | Trigger |
|----------|-----------|---------|
| `lib/posts-generated.json` | `generate-posts.mjs` | `predev`, `prebuild` |
| `public/rss.xml` | `generate-rss.mjs` | `prebuild` |
| `dist/**/index.html`, `dist/404.html` | `prerender.mjs` | after `vite build` |
| `dist/sitemap.xml`, `dist/robots.txt` | `generate-sitemap.mjs` | after prerender |

RSS is the subscription channel — there is no email signup on the static site.
After deploying a new post, submit
`https://dheerajreddybhumanapalli.github.io/sitemap.xml` in Google Search
Console and Bing Webmaster Tools so it gets indexed.
