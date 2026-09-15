# Design Suggestions + Roadmap

Ideas for the personal website + newsletter, ranked by impact. Everything below
is compatible with the static-export setup (`output: "export"`, GitHub Pages,
no API routes / server actions / middleware).

## Agreed direction (do not relitigate without reason)

- **Personal site — keep as-is.** Home page (Hero, Projects, Experience,
  Contact) + Resume is enough. No dedicated `/about` page. Future personal-site
  work = content edits only (`data/portfolio.ts`, `Hero`, `Contact`, `resume.pdf`).
- **Publishing — newsletter-style feed, RSS only.** Issue-numbered
  (oldest published post = Issue #1), newest-first listing + year-grouped
  archive, per-issue pages with prev/next + related issues, tags (`ai-news`
  for news roundups, `newsletter` for hands-on notes), search, sitemap, and
  `/rss.xml` as the subscription channel. No email backend while on static hosting.

## Phase 1 — newsletter feed (highest priority)

### 1. Issue numbering in `lib/posts.ts`
- Auto-assign issue numbers by publish date: oldest published post = Issue #1.
- Expose on `PostMeta`/`Post` (e.g. `issueNumber`) so cards, post pages, and
  the archive share one source of truth. No `issue` frontmatter field.
- Show "Issue #N" badge on `BlogCard`, the `[slug]` header, `PostNav`
  ("Newer/Older issue"), and related-issues section.

### 2. Archive on `/blog`
- Keep newest-first feed, then add a year-grouped archive index
  (year → issues with date + title links) below the search/tag filter.
- Keep `/blog/tag/[tag]` pages; they double as topic archives
  (`ai-news` vs `newsletter`).

### 3. Rebrand labels, keep URLs
- Rename UI copy Blog → Newsletter ("Newsletter", "Latest issues",
  "All issues", "Related issues") in `Navbar`, `/blog` header,
  `LatestPosts`, `Footer`, and metadata — but keep the `/blog` route and
  `/rss.xml` path so existing links and feeds don't break.
- Update RSS channel title/description to the newsletter name.

## High impact (reader experience)

### 4. Custom 404 page (`app/not-found.tsx`)
- There is currently no custom `not-found.tsx`, so mistyped URLs (e.g. old
  shared links) render Next's default page.
- Add a branded 404 with the site's fonts/colors plus links to Home, Newsletter,
  and the RSS feed so lost visitors stay on the site.

### 5. Reading progress bar + table of contents on issue pages
- Long technical issues perform better with orientation aids.
- Progress bar: tiny client component tracking scroll position.
- Table of contents: extract headings at build time in `lib/posts.ts`
  (from the Markdown AST) and render anchor links in a sidebar (desktop) or
  collapsible block (mobile).

### 6. Code-block copy button
- The audience is developers reading snippets. Add a small client-side copy
  button to `pre` blocks rendered inside `.post-body`.
- No new dependencies; reuse the clipboard pattern from `ShareButtons`.

### 7. Breadcrumbs on issue pages (Home / Newsletter / Title)
- Improves navigation and gives search engines a clear hierarchy.
- Pairs with the existing `BlogPosting` JSON-LD; optionally add a
  `BreadcrumbList` schema block alongside it.

### 8. Default OG social image
- Posts without a custom `image` in frontmatter currently emit no `og:image`,
  so X/LinkedIn shares render as bare text links.
- Create one 1200x630 branded PNG in `public/` (site name + accent color)
  and use it as the fallback `openGraph.images` / `twitter.images` in
  `generateMetadata` and the root layout. Per-post `image` frontmatter keeps
  overriding it when present.
- Dynamic `opengraph-image.tsx` (`ImageResponse`) is NOT supported with
  static export, so this must be a checked-in static file.

## Polish

### 9. Featured / pinned issue
- Support `featured: true` in post frontmatter.
- Render the featured issue large at the top of `/blog` and in the home
  "Latest issues" teaser so returning visitors notice what's new.

### 10. Richer footer
- Current footer is minimal. Expand to columns: sitemap (Home, Newsletter, RSS),
  popular tag links, socials (GitHub / LinkedIn), and a "Built with Next.js"
  note.

### 11. Skip-to-content link + focus-visible styles
- Quick accessibility wins: a skip link before the navbar and visible focus
  rings on interactive elements (search input, tag chips, share buttons).

### 12. Search shortcut + result counts on `/blog`
- Press `/` to focus the search box; show counts like "3 issues tagged
  ai-news" and "N results" so the listing feels finished.

### 13. Theme-color meta + Apple touch icon
- Add `export const viewport` with `themeColor` in `app/layout.tsx` and a
  180px `apple-touch-icon.png` in `public/` so mobile tabs/bookmarks look
  intentional.

## Visual design (larger effort, subjective)

### 14. Hero depth
- The home hero is clean but flat. Options that keep the light/dark token
  system: a subtle radial gradient glow in the accent color, a stat row
  (years of experience, records processed, models served), or a
  terminal-style card showing a snippet of the stack.

### 15. Section rhythm
- Alternate card backgrounds or add numbered section markers
  ("01 · Projects") so the long home scroll has visual landmarks.

## Explicitly out of scope (for now)

- **Email subscriptions / newsletter backend**: needs a server or an external
  service (e.g. Buttondown/Substack embed). RSS stays the subscription channel.
- **Comments** (Giscus/Disqus): third-party embed plus moderation burden.
  Add only if issues get traction.
- **View counts, likes**: require servers; revisit only if the site ever
  leaves static hosting.
- **Heavy animation libraries or extra font families**: the current setup is
  fast — protect that.
