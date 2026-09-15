# Deployment

Hosting: GitHub Pages, served from the `gh-pages` branch (root). Source branch
is `master` — never edit `gh-pages` directly.

## One-time GitHub setup

Repo → **Settings** → **Pages** → **Build and deployment**:

- **Source:** Deploy from a branch
- **Branch:** `gh-pages` / `(root)`

## Deploying

```bash
git checkout master
git pull origin master
npm run deploy
```

This runs `predeploy` → `npm run build` (full pipeline: articles catalog, RSS,
Vite build, per-route prerender, sitemap), then `gh-pages -d dist --nojekyll`.
`Published` means success; allow 1–2 minutes for Pages to update.

`public/.nojekyll` is deployed as `dist/.nojekyll` and the `--nojekyll` flag
reinforces it, so GitHub Pages serves asset files as-is instead of running
Jekyll over them.

## How deep links work

This is a user site (`<username>.github.io`), served from the domain root, so
Vite `base` is `"/"` and no sub-path handling is needed. Because prerender
emits a real HTML file per route (`/articles/`, `/articles/:slug/`,
`/articles/tag/:tag/`), direct URLs resolve without server rewrites. Old
`/blog/*` paths serve meta-refresh redirect shims to their `/articles/*`
equivalents. Paths with
no prerendered file fall back to `dist/404.html`, which boots the SPA router
(`*` → `NotFound` page).

## Local production check

```bash
npm run build
npm run preview   # serves dist/, default http://localhost:4173/
```

Verify an article page, a tag page, `/rss.xml`, and `/sitemap.xml` before
deploying.

## When Pages shows old content

- Hard-refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Confirm the `gh-pages` branch updated after deploy
- Wait 1–2 minutes for the GitHub CDN cache
