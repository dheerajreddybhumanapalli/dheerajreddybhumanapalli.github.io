import { useMemo, useState } from "react";
import { FileSearch, Search } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { cn } from "@/lib/utils";
import { ArticleCard } from "@/components/ArticleCard";

interface ArticleListProps {
  articles: ArticleMeta[];
  tags: string[];
}

export function ArticleList({ articles, tags }: ArticleListProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (activeTag && !article.tags.includes(activeTag)) return false;
      if (!q) return true;
      const haystack = `${article.title} ${article.summary} ${article.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [articles, query, activeTag]);

  const isFiltering = query.trim().length > 0 || activeTag !== null;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground shadow-sm placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
              activeTag === null
                ? "bg-accent text-accent-foreground shadow-sm shadow-accent/30"
                : "border border-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              aria-pressed={activeTag === tag}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-mono text-sm font-medium transition-all",
                activeTag === tag
                  ? "bg-accent text-accent-foreground shadow-sm shadow-accent/30"
                  : "border border-border bg-card text-muted hover:border-accent/40 hover:text-foreground"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {articles.length === 0
          ? "No articles published yet."
          : isFiltering
            ? `${filtered.length} of ${articles.length} ${articles.length === 1 ? "article" : "articles"}`
            : `${articles.length} ${articles.length === 1 ? "article" : "articles"}`}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <FileSearch className="h-10 w-10 text-muted" aria-hidden />
          <p className="mt-4 font-medium">No articles found</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            {articles.length === 0
              ? "Check back soon — new articles are on the way."
              : "Try a different search term or clear the tag filter."}
          </p>
          {isFiltering && articles.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveTag(null);
              }}
              className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
