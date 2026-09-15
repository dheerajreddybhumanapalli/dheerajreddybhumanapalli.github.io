# Personal Website + Technical Newsletter — Dheeraj Reddy Bhumanapalli

A personal website built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**. It is a fully static multi-page application exported for hosting on **GitHub Pages**.

**Live site:** [https://dheerajreddybhumanapalli.github.io/](https://dheerajreddybhumanapalli.github.io/)

---

## Vision

Two jobs, one static site (no backend):

1. **Personal website — "know about me".** The home page stays as-is: Hero (name, title, bio, photo), Projects, Experience, Contact, plus Resume. No dedicated `/about` page planned — updating `data/portfolio.ts`, `components/Hero.tsx`, and `components/Contact.tsx` is enough.
2. **News / technical newsletter platform.** The `/blog` section becomes a **newsletter-style feed**: issue-numbered (oldest published post = Issue #1, newest = highest number), newest-first listing plus a year-grouped **archive**, per-issue pages with prev/next + related issues, tag pages (`ai-news`, `newsletter`, …), search, sitemap, and **RSS-only distribution** (`/rss.xml`). No email-subscription backend while on static hosting — RSS is the subscription channel.

See `DESIGN_SUGGESTIONS.md` for the phased roadmap (newsletter feed first, reader-experience polish next, explicit non-goals).

---

## Features

- Single-page home layout with smooth in-page navigation (Home, Projects, Experience, Contact)
- Newsletter (`/blog`) with per-issue pages, tag pages, search, year-grouped archive (planned), issue numbering oldest = #1 (planned), RSS, sitemap, and per-issue SEO metadata
- Dark / light theme toggle with system preference support
- Scroll-triggered section highlighting in the navbar
- Expandable project cards with tech stack tags
- Vertical experience timeline
- Contact section with copy-to-clipboard
- Responsive design (mobile + desktop)
- SEO metadata and Open Graph tags
- Static export — no backend or database required

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Language | TypeScript |
| Hosting | GitHub Pages (`gh-pages` branch) |

---

## Prerequisites

- **Node.js** 18.18 or later (Node 20+ recommended)
- **npm** (comes with Node.js)
- A GitHub account (for deployment)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dheerajreddybhumanapalli/dheerajreddybhumanapalli.github.io.git
cd dheerajreddybhumanapalli.github.io
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production static export for **local** preview |
| `npm run build:pages` | Production static export for **GitHub Pages** (same as `build`; kept for compatibility) |
| `npm run start` | Serve the `out/` folder locally after `npm run build` |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build for GitHub Pages and publish to the `gh-pages` branch |

### Local production preview

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** `next start` does **not** work with this project because it uses `output: "export"` (static HTML). Use `npm run start`, which serves the `out/` directory with `serve`.

### Development vs production preview vs deploy

| Goal | Command | URL |
|------|---------|-----|
| Active development | `npm run dev` | `http://localhost:3000/` |
| Test production build locally | `npm run build && npm run start` | `http://localhost:3000/` |
| Publish to GitHub Pages | `npm run deploy` | `https://dheerajreddybhumanapalli.github.io/` |

---

## Deploying to GitHub Pages

### One-time GitHub setup

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` / `(root)`

### Deploy from your machine

```bash
git checkout master
git pull origin master
npm run deploy
```

This runs:

1. `predeploy` → `npm run build:pages` — static export with no base path (user site is served from the domain root)
2. `deploy` → `gh-pages -d out --nojekyll` — pushes the `out/` folder to the `gh-pages` branch (the `--nojekyll` flag is required so GitHub Pages serves the `_next/` directory)

You should see `Published` when it succeeds. Allow 1–2 minutes for GitHub Pages to update.

### How the base path works

This repo is a user site (`<username>.github.io`), so GitHub Pages serves it from the domain root:

```
https://dheerajreddybhumanapalli.github.io/
```

That means `next.config.ts` uses **no `basePath` / `assetPrefix`**. (A `basePath` like `/portfolio` is only needed for project sites served at `<username>.github.io/<repo>/`.)

All static assets and links use `assetPath()` from `lib/utils.ts` so paths keep working if a base path is ever reintroduced.

---

## Project Structure

```
dheerajreddybhumanapalli.github.io/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout, fonts, metadata, theme provider
│   ├── page.tsx            # Home page — composes all sections
│   ├── blog/
│   │   ├── page.tsx        # Blog listing (search + tag filter)
│   │   ├── [slug]/page.tsx # Blog post page (SEO meta + JSON-LD)
│   │   └── tag/[tag]/page.tsx # Tag listing page
│   ├── sitemap.ts          # Static sitemap.xml
│   └── globals.css         # Tailwind import + CSS custom properties (themes)
├── components/             # React components
│   ├── Navbar.tsx          # Route-aware nav (anchors on home, links on blog)
│   ├── Footer.tsx          # Shared footer (Blog, RSS, Resume links)
│   ├── Hero.tsx            # Profile intro, CTA buttons
│   ├── Projects.tsx        # Projects section wrapper
│   ├── ProjectCard.tsx     # Expandable project card
│   ├── Experience.tsx      # Experience section wrapper
│   ├── ExperienceTimeline.tsx
│   ├── Contact.tsx         # Email/phone with copy buttons
│   ├── BlogCard.tsx        # Blog post preview card
│   ├── BlogList.tsx        # Client-side search + tag filter for /blog
│   ├── LatestPosts.tsx     # Home page "Latest posts" teaser section
│   ├── ShareButtons.tsx    # X / LinkedIn / copy-link share (no backend)
│   ├── PostNav.tsx         # Prev/next navigation + related posts
│   ├── SectionHeading.tsx  # Reusable section title
│   ├── FadeIn.tsx          # Framer Motion scroll animation
│   └── ThemeProvider.tsx   # next-themes wrapper
├── content/
│   └── blog/               # Blog posts in Markdown (see _template.md)
│       └── _template.md    # Frontmatter + formatting reference (ignored by build)
├── data/
│   └── portfolio.ts        # Projects & experience content (edit here)
├── scripts/
│   └── generate-rss.mjs    # Builds public/rss.xml before every build
├── lib/
│   └── utils.ts            # cn(), assetPath(), basePath helpers
├── public/                 # Static assets (copied to out/ on build)
│   ├── profile_image.jpg
│   ├── resume.pdf
│   ├── favicon.ico
│   ├── robots.txt
│   └── .nojekyll           # Disables Jekyll on GitHub Pages
├── next.config.ts          # Static export + GitHub Pages config
├── postcss.config.mjs      # Tailwind PostCSS plugin
├── tsconfig.json           # TypeScript config (@/* path alias)
├── package.json
├── README.md
└── AGENTS.md               # Guide for AI coding agents
```

---

## Updating Content

### Projects and experience

Edit `data/portfolio.ts`. Each entry follows the `CardItem` interface:

```typescript
export interface Role {
  designation: string;   // Job title or tech stack
  duration: string;      // e.g. "Jan 2025 – Present"
  description: string[]; // Bullet points
}

export interface CardItem {
  title: string;
  roles: Role[];
}
```

After editing, run `npm run dev` to preview, then `npm run deploy` to publish.

### Publishing a newsletter issue

1. Copy `content/blog/_template.md` to a new file, e.g. `content/blog/vllm-vs-sglang-first-look.md`.
   - Filename rules: lowercase letters, numbers, and hyphens only. The filename becomes the URL (`/blog/vllm-vs-sglang-first-look/`).
   - Files starting with `_` (like `_template.md`) are ignored.
2. Fill in the frontmatter:
   - `title`, `date` (`YYYY-MM-DD`), `summary` (1–2 sentences, used for SEO), `tags` (e.g. `[ai-news, newsletter]` — use `ai-news` for news roundups, `newsletter` for hands-on technical notes)
   - Optional: `image` (path to a custom OG image in `public/`), `draft: true` (hides the post until you remove it)
   - Issue numbers are **planned** (auto-assigned oldest = Issue #1); do not add an `issue` field today.
3. Write the body in Markdown (headings, code blocks, tables, quotes all supported).
4. Preview with `npm run dev` → `http://localhost:3000/blog/your-slug/`.
5. Publish with `npm run deploy`. The RSS feed (`/rss.xml`) and sitemap regenerate automatically on every build. RSS is the subscription channel — there is no email signup on the static site.

> After deploying, submit `https://dheerajreddybhumanapalli.github.io/sitemap.xml` in Google Search Console and Bing Webmaster Tools so new posts get indexed.

### Contact info

Edit the `contactInfo` array in `components/Contact.tsx`.

### Hero section

Edit `components/Hero.tsx` for name, title, bio, and image.

### Resume and profile image

Replace files in `public/`:

- `public/resume.pdf`
- `public/profile_image.jpg`

### Site metadata (title, description)

Edit `export const metadata` in `app/layout.tsx`.

---

## Styling & Theming

- **Tailwind v4** is configured via `postcss.config.mjs` and imported in `app/globals.css`.
- Theme colors are CSS custom properties in `:root` (light) and `.dark` (dark).
- The accent color is emerald green (`--accent`).
- Fonts: **Inter** (body) and **JetBrains Mono** (mono), loaded via `next/font/google` in `app/layout.tsx`.
- Use `cn()` from `lib/utils.ts` to merge Tailwind class names.

---

## Git Branches

| Branch | Purpose |
|--------|---------|
| `master` | Source code (active development) |
| `gh-pages` | Built static site deployed by GitHub Pages (auto-updated by `npm run deploy`) |

---

## Roadmap (personal site + newsletter)

Personal site: **keep as-is** — content edits only (`data/portfolio.ts`, `Hero`, `Contact`, `resume.pdf`).

Newsletter feed (all static-export compatible, details in `DESIGN_SUGGESTIONS.md`):

- **Phase 1 — newsletter feed:** auto issue numbers (oldest = #1) in `lib/posts.ts`; Issue badges on cards + post pages; year-grouped archive on `/blog`; rebrand UI labels Blog → Newsletter (keep `/blog` URLs + RSS path); "Latest issues" teaser on home; RSS channel copy → newsletter.
- **Phase 2 — reader experience:** reading progress bar + table of contents, code-block copy button, breadcrumbs, default OG social image fallback.
- **Phase 3 — discovery:** featured/pinned issue, richer footer, search shortcut + result counts, theme-color meta + touch icon.
- **Non-goals while on GitHub Pages static hosting:** email subscriptions/backend, comments, view counts/likes, API routes/server actions/middleware. Email would require an external service (e.g. Buttondown/Substack embed) — RSS stays the subscription channel unless that decision changes.

---

## Troubleshooting

### `next start` fails with `output: export` error

Expected. This app is statically exported. Use:

```bash
npm run build && npm run start
```

### Blank page or broken styles on GitHub Pages

Make sure you deploy with `npm run deploy` so the `out/` folder is rebuilt and pushed to the `gh-pages` branch. If styles/JS are broken, open devtools and check for 404s under `_next/static/` — that usually means the deployed HTML references a stale `basePath` or the `--nojekyll` flag was missing.

### CSS/JS 404 — unstyled page or invisible content

GitHub Pages runs Jekyll by default, which **ignores folders starting with `_`** (like `_next/`). The deploy script must include `--nojekyll`:

```json
"deploy": "gh-pages -d out --nojekyll"
```

Without this, HTML loads but all `_next/static/` assets return 404, so Tailwind styles and React/Framer Motion never run.

### Assets 404 on GitHub Pages but work locally

Ensure links to static files use `assetPath()`:

```typescript
import { assetPath } from "@/lib/utils";

<img src={assetPath("/profile_image.jpg")} />
<a href={assetPath("/resume.pdf")}>Resume</a>
```

### GitHub Pages shows old content

- Hard-refresh the browser (Cmd+Shift+R / Ctrl+Shift+R)
- Confirm `gh-pages` branch was updated after deploy
- Wait 1–2 minutes for GitHub CDN cache

---

## License

Private project. All rights reserved.

## Author

**Dheeraj Reddy Bhumanapalli**  
Email: dheerajbhumanapalli@gmail.com
