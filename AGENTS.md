# AGENTS.md

Static portfolio + blog for Dheeraj Reddy Bhumanapalli. Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS v4. Deployed to GitHub Pages as a static export.

## Commands

```bash
npm run dev            # dev server → http://localhost:3000/
npm run build          # static export to out/ (runs prebuild: RSS first)
npm run start          # serve out/ locally (next start does NOT work with output: export)
npm run lint           # next lint
npm run deploy         # build:pages + push out/ to gh-pages branch
```

- No test suite. Verify with `npm run lint` and `npm run build`.
- `build` and `build:pages` are currently identical (no `basePath`); both run `scripts/generate-rss.mjs` via `prebuild`.
- Source branch is `master`; `gh-pages` holds only built output — never edit it.

## Architecture

- `app/page.tsx`, `app/layout.tsx` — home page + root metadata/fonts/theme.
- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/blog/tag/[tag]/page.tsx` — all use `generateStaticParams`; blog needs no backend.
- `app/sitemap.ts` (`force-static`) + `scripts/generate-rss.mjs` → `public/rss.xml` regenerate on every build.
- `content/blog/*.md` — blog source. `_*.md` files (e.g. `_template.md`) are ignored.
- `lib/posts.ts` — parses frontmatter with `gray-matter`, renders with `remark` + `remark-html`. `getAllPosts` / `getPostBySlug` / `getAllTags`.
- `data/portfolio.ts` — projects/experience content (`CardItem`/`Role`). Edit content here, not in components.
- `lib/utils.ts` — `cn()`, `basePath`, `assetPath()`.
- `components/` — one section per file, all **named exports**; `FadeIn` for scroll animation, `ThemeProvider` wraps app.

## Blog post rules (`lib/posts.ts` throws on violations)

- Filename = slug: `^[a-z0-9]+(-[a-z0-9]+)*\.md` (lowercase, hyphens). `_`-prefixed files skipped; `draft: true` hides post from listing, RSS, and sitemap.
- Required frontmatter: `title`, `date: YYYY-MM-DD`, `summary`, `tags: [list]` (lowercased, deduped). Optional `image`, `draft`.
- Copy `content/blog/_template.md` for new posts.

## Conventions

- Imports via `@/` alias (e.g. `@/lib/utils`); no new runtime deps without need.
- Static URLs must use `assetPath("/...")` — including `<next/image src>` and `resume.pdf` / `rss.xml` links — so a future `basePath` keeps working. `NEXT_PUBLIC_BASE_PATH` is currently `""` (user site served from domain root).
- Static-export constraints: `output: "export"`, `images: { unoptimized: true }`, `trailingSlash: true` in `next.config.ts`. No API routes, server actions, or middleware.
- Styling: Tailwind v4 (`@import "tailwindcss"` in `app/globals.css`, configured via `postcss.config.mjs`). Theme is CSS vars in `:root`/`.dark`; dark mode needs `@custom-variant dark` + `dark:` classes via `next-themes`. Merge classes with `cn()`.
- Animations: framer-motion via `FadeIn`; respect `useReducedMotion`. Icons: lucide-react only.
