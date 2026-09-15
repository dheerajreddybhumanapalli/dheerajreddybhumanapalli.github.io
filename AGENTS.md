# AGENTS.md

Static portfolio + blog for Dheeraj Reddy Bhumanapalli. React 19 + Vite + React Router, TypeScript strict, Tailwind CSS v4. No Next.js. Deployed to GitHub Pages as prerendered static files.

## Commands

```bash
npm run dev            # vite dev server → http://localhost:5173/ (runs predev: posts catalog first)
npm run build          # posts catalog + RSS + vite build + prerender routes + sitemap → dist/
npm run preview        # serve dist/ locally
npm run lint           # tsc --noEmit
npm run deploy         # build + push dist/ to gh-pages branch
```

- No test suite. Verify with `npm run lint` and `npm run build`.
- Source branch is `master`; `gh-pages` holds only built output — never edit it.

## Architecture

- `index.html` — shell: root element, Google Fonts (Inter + JetBrains Mono), default meta, theme boot script.
- `src/main.tsx` — entry: `BrowserRouter` + `ThemeProvider` + `App` + `src/globals.css`.
- `src/App.tsx` — routes: `/`, `/blog`, `/blog/:slug`, `/blog/tag/:tag`, `*` (NotFound).
- `src/pages/` — `Home`, `BlogIndex`, `BlogPost`, `TagPage`, `NotFound`. Per-route SEO via `components/SEO.tsx` (sets title/meta/canonical/JSON-LD at runtime).
- `scripts/generate-posts.mjs` → `lib/posts-generated.json` (committed) runs on predev/prebuild; `lib/posts.ts` is a pure query layer over it (`getAllPosts` / `getPostBySlug` / `getAllTags`) — no I/O, no `fs`.
- `scripts/generate-rss.mjs` → `public/rss.xml` (copied to `dist/` by Vite) runs on prebuild.
- `scripts/prerender.mjs` — after `vite build`, writes one HTML file per route into `dist/` (route-specific head tags + static content snapshot into `#root`, replaced by the SPA on boot) plus `dist/404.html` SPA fallback. This preserves direct URLs and SEO without Next.js.
- `scripts/generate-sitemap.mjs` → `dist/sitemap.xml` + `dist/robots.txt` runs after prerender.
- `content/blog/*.md` — blog source. `_*.md` files (e.g. `_template.md`) are ignored.
- `data/portfolio.ts` — projects/experience content (`CardItem`/`Role`). Edit content here, not in components.
- `lib/utils.ts` — `cn()`, `basePath`, `assetPath()`.
- `components/` — one section per file, all **named exports**; `FadeIn` for scroll animation, `ThemeProvider` (custom context + localStorage, replaces `next-themes`) wraps app.

## Blog post rules (`scripts/generate-posts.mjs` throws on violations)

- Filename = slug: `^[a-z0-9]+(-[a-z0-9]+)*\.md` (lowercase, hyphens). `_`-prefixed files skipped; `draft: true` hides post from listing, RSS, and sitemap.
- Required frontmatter: `title`, `date: YYYY-MM-DD`, `summary`, `tags: [list]` (lowercased, deduped). Optional `image`, `draft`.
- Copy `content/blog/_template.md` for new posts.

## Conventions

- Imports via `@/` alias (e.g. `@/lib/utils`); no new runtime deps without need.
- Routing via `react-router-dom` (`Link to=`, `useLocation`, `useParams`). No `next/link`, `next/navigation`, `next/image` (use plain `<img>`), or `next/font` (use the Google Fonts links in `index.html`).
- Static URLs must use `assetPath("/...")` — including `<img src>` and `resume.pdf` / `rss.xml` links — so a future Vite `base` keeps working. Base is currently `"/"` (user site served from domain root).
- Static-hosting constraints: no API routes, server actions, or middleware. Deep links work because prerender emits real HTML per route; unknown paths fall back to `404.html`.
- Styling: Tailwind v4 (`@import "tailwindcss"` in `src/globals.css`, configured via `postcss.config.mjs`). Theme is CSS vars in `:root`/`.dark`; dark mode needs `@custom-variant dark` + `dark:` classes via the custom `ThemeProvider`. Merge classes with `cn()`.
- Animations: framer-motion via `FadeIn`; respect `useReducedMotion`. Icons: lucide-react only.
